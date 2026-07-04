import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../database/prisma.js";
import { encrypt, decrypt } from "../crypto/aes.service.js";
import { generateSHA256 } from "../crypto/hash.service.js";
import { ContractService } from "../blockchain/contract.service.js";
import { generatePromotionDecree } from "./document.service.js";

const contractService = new ContractService();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMOTION_UPLOAD_DIR = path.join(__dirname, "../../uploads/promotion");

export function promotionCertificatePath(promotionId: string): string {
  return path.join(PROMOTION_UPLOAD_DIR, `${promotionId}.pdf`);
}

export async function listPromotions(filter?: {
  status?: string;
  employeeId?: string;
  requestedById?: string;
}) {
  return prisma.promotion.findMany({
    where: {
      status: filter?.status as "Pending" | "Approved" | "Rejected" | undefined,
      employeeId: filter?.employeeId,
      requestedById: filter?.requestedById,
    },
    include: {
      employee: { include: { user: true, department: true } },
      targetPosition: true,
      requestedBy: { select: { id: true, name: true, walletAddress: true } },
      approvedBy: { select: { id: true, name: true, walletAddress: true } },
      evaluation: { select: { id: true, totalScore: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPromotionById(id: string) {
  return prisma.promotion.findUnique({ where: { id } });
}

const PROMOTABLE_EVALUATION_STATUSES = ["Approved", "PromotionRecommended"] as const;

export async function createPromotion(data: {
  evaluationId: string;
  employeeId: string;
  targetPositionId: string;
  reason: string;
  requestedById: string;
}) {
  const evaluation = await prisma.evaluation.findUnique({ where: { id: data.evaluationId } });
  if (!evaluation) {
    throw Object.assign(new Error("Evaluasi tidak ditemukan."), { status: 404 });
  }
  if (evaluation.employeeId !== data.employeeId) {
    throw Object.assign(new Error("Evaluasi ini bukan milik karyawan yang dipilih."), { status: 400 });
  }
  if (!PROMOTABLE_EVALUATION_STATUSES.includes(evaluation.status as (typeof PROMOTABLE_EVALUATION_STATUSES)[number])) {
    throw Object.assign(
      new Error(
        `Evaluasi harus berstatus Approved atau PromotionRecommended sebelum bisa diajukan promosi (status saat ini: ${evaluation.status}).`
      ),
      { status: 409 }
    );
  }

  return prisma.promotion.create({
    data: {
      evaluationId: data.evaluationId,
      employeeId: data.employeeId,
      targetPositionId: data.targetPositionId,
      reasonEncrypted: encrypt(data.reason),
      requestedById: data.requestedById,
      status: "Pending",
    },
    include: {
      employee: { include: { user: true } },
      targetPosition: true,
      requestedBy: { select: { id: true, name: true } },
    },
  });
}

export async function approvePromotion(id: string, approvedById: string) {
  const promotion = await prisma.promotion.findUnique({
    where: { id },
    include: {
      employee: { include: { user: true, department: true, position: true } },
      targetPosition: true,
      evaluation: { include: { period: true } },
      requestedBy: { select: { name: true } },
    },
  });
  if (!promotion) return null;

  const approvedByUser = await prisma.user.findUnique({ where: { id: approvedById }, select: { name: true } });

  // Best-effort display number, not a strict atomic sequence.
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const countThisYear = await prisma.promotion.count({ where: { createdAt: { gte: yearStart } } });
  const skNumber = `SK/${new Date().getFullYear()}/EPS/${String(countThisYear + 1).padStart(4, "0")}`;

  const pdfBuffer = await generatePromotionDecree({
    skNumber,
    promotionId: id,
    employeeName: promotion.employee.fullName,
    employeeCode: promotion.employee.employeeCode,
    departmentName: promotion.employee.department.name,
    oldPositionName: promotion.employee.position.name,
    oldPositionLevel: promotion.employee.position.level,
    newPositionName: promotion.targetPosition.name,
    newPositionLevel: promotion.targetPosition.level,
    reason: tryDecrypt(promotion.reasonEncrypted),
    evaluationScore: promotion.evaluation?.totalScore ?? null,
    evaluationPeriod: promotion.evaluation?.period?.name ?? null,
    requestedByName: promotion.requestedBy.name,
    approvedByName: approvedByUser?.name ?? "Direktur",
    approvedAt: new Date(),
  });

  // Hash the exact PDF bytes once, at generation time — this is the value
  // anchored on-chain, so the decree file itself becomes tamper-evident.
  const hash = generateSHA256(pdfBuffer);
  await fs.mkdir(PROMOTION_UPLOAD_DIR, { recursive: true });
  await fs.writeFile(promotionCertificatePath(id), pdfBuffer);

  const updated = await prisma.promotion.update({
    where: { id },
    data: {
      status: "Approved",
      approvedById,
      promotionHash: hash,
      skNumber,
      documentPath: `uploads/promotion/${id}.pdf`,
    },
    include: {
      employee: { include: { user: true, position: true } },
      targetPosition: true,
      approvedBy: { select: { id: true, name: true, walletAddress: true } },
    },
  });

  // Update employee position
  await prisma.employee.update({
    where: { id: promotion.employeeId },
    data: { positionId: promotion.targetPositionId },
  });

  // Update evaluation status on blockchain
  if (promotion.evaluationId) {
    await prisma.evaluation.update({
      where: { id: promotion.evaluationId },
      data: { status: "PromotionApproved" },
    });
  }

  // Blockchain call — awaited (not fire-and-forget) so a later action that
  // depends on this promotion existing on-chain never races ahead of it.
  let blockchainTxHash: string | null = null;
  try {
    const receipt = await contractService.approvePromotion(id, promotion.evaluationId ?? id, hash);
    blockchainTxHash = receipt.transactionHash;
    await prisma.promotion.update({
      where: { id },
      data: { blockchainTxHash: receipt.transactionHash },
    });
    await prisma.blockchainTransaction.create({
      data: {
        promotionId: id,
        evaluationId: promotion.evaluationId ?? undefined,
        contractAddress: process.env.SMART_CONTRACT_ADDRESS ?? "",
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        walletAddress: approvedById,
        action: "approvePromotion",
        syncStatus: receipt.status,
      },
    });
  } catch (err) {
    console.error(`approvePromotion on-chain call failed for promotion ${id}:`, err);
  }

  return { ...updated, blockchainTxHash, reason: tryDecrypt(updated.reasonEncrypted) };
}

export async function rejectPromotion(id: string, rejectedById: string) {
  const updated = await prisma.promotion.update({
    where: { id },
    data: { status: "Rejected", approvedById: rejectedById },
    include: { employee: { include: { user: true } }, targetPosition: true },
  });
  return updated;
}

function tryDecrypt(payload: string): string {
  try { return decrypt(payload); } catch { return ""; }
}
