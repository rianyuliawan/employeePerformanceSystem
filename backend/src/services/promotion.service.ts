import { prisma } from "../database/prisma.js";
import { encrypt, decrypt } from "../crypto/aes.service.js";
import { generateSHA256 } from "../crypto/hash.service.js";
import { ContractService } from "../blockchain/contract.service.js";

const contractService = new ContractService();

export async function listPromotions(filter?: { status?: string; employeeId?: string }) {
  return prisma.promotion.findMany({
    where: {
      status: filter?.status as "Pending" | "Approved" | "Rejected" | undefined,
      employeeId: filter?.employeeId,
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

export async function createPromotion(data: {
  evaluationId: string;
  employeeId: string;
  targetPositionId: string;
  reason: string;
  requestedById: string;
}) {
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
    include: { employee: true, evaluation: true },
  });
  if (!promotion) return null;

  const hash = generateSHA256(`${id}-${promotion.employeeId}-${Date.now()}`);

  const updated = await prisma.promotion.update({
    where: { id },
    data: {
      status: "Approved",
      approvedById,
      promotionHash: hash,
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

  // Blockchain call
  contractService
    .approvePromotion(id, promotion.evaluationId ?? id, hash)
    .then(async (receipt) => {
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
    })
    .catch(() => undefined);

  return { ...updated, reason: tryDecrypt(updated.reasonEncrypted) };
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
