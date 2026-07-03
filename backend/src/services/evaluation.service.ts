import { prisma } from "../database/prisma.js";
import { encrypt, decrypt } from "../crypto/aes.service.js";
import { generateSHA256 } from "../crypto/hash.service.js";
import { ContractService } from "../blockchain/contract.service.js";
import type { EvaluationStatus } from "@prisma/client";

const contractService = new ContractService();

const KPI_INDICATORS = [
  "Discipline",
  "Communication",
  "Leadership",
  "Teamwork",
  "Responsibility",
  "Productivity",
  "Initiative",
] as const;

export async function createEvaluation(data: {
  employeeId: string;
  managerId: string;
  periodId: string;
  scores: Array<{ indicator: string; score: number; weight: number; notes?: string }>;
  comment: string;
}) {
  const totalWeight = data.scores.reduce((s, i) => s + i.weight, 0) || 1;
  const totalScore = data.scores.reduce((s, i) => s + i.score * i.weight, 0) / totalWeight;

  const docContent = JSON.stringify({
    employeeId: data.employeeId,
    periodId: data.periodId,
    scores: data.scores,
    comment: data.comment,
    createdAt: new Date().toISOString(),
  });
  const documentHash = generateSHA256(docContent);

  // Save to DB first
  const evaluation = await prisma.evaluation.create({
    data: {
      employeeId: data.employeeId,
      managerId: data.managerId,
      periodId: data.periodId,
      totalScore: Number(totalScore.toFixed(2)),
      commentEncrypted: encrypt(data.comment),
      documentHash,
      status: "Submitted",
      blockchainStatus: "Pending",
      details: {
        create: data.scores.map((s) => ({
          indicator: s.indicator,
          score: s.score,
          weight: s.weight,
          notes: s.notes ?? null,
        })),
      },
    },
    include: { details: true, employee: { include: { user: true } }, manager: true },
  });

  // Send to blockchain (non-blocking)
  contractService
    .submitEvaluation(evaluation.id, data.employeeId, documentHash)
    .then(async (receipt) => {
      await prisma.evaluation.update({
        where: { id: evaluation.id },
        data: {
          blockchainStatus: receipt.status,
          blockchainTxHash: receipt.transactionHash,
          blockchainBlockNum: receipt.blockNumber,
        },
      });
      await prisma.blockchainTransaction.create({
        data: {
          evaluationId: evaluation.id,
          contractAddress: process.env.SMART_CONTRACT_ADDRESS ?? "",
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          walletAddress: data.managerId,
          action: "submitEvaluation",
          syncStatus: receipt.status,
        },
      });
    })
    .catch(() => undefined); // failure → stays Pending

  return formatEvaluation(evaluation);
}

export async function listEvaluations(filter?: {
  managerId?: string;
  employeeId?: string;
}) {
  const evaluations = await prisma.evaluation.findMany({
    where: filter,
    include: {
      details: true,
      employee: { include: { user: true, department: true, position: true } },
      manager: true,
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return evaluations.map(formatEvaluation);
}

export async function getEvaluation(id: string) {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    include: {
      details: true,
      employee: { include: { user: true, department: true, position: true } },
      manager: true,
      period: true,
      blockchainTxs: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!evaluation) return null;
  return formatEvaluation(evaluation);
}

export async function updateEvaluationStatus(
  id: string,
  status: EvaluationStatus,
  action: string,
  actorId: string
) {
  const evaluation = await prisma.evaluation.findUnique({ where: { id } });
  if (!evaluation) return null;

  const updated = await prisma.evaluation.update({
    where: { id },
    data: { status, updatedAt: new Date() },
    include: { details: true, employee: { include: { user: true } }, manager: true },
  });

  // Send blockchain event
  let receipt;
  switch (action) {
    case "review":
      receipt = await contractService.reviewEvaluation(id).catch(() => null);
      break;
    case "approve":
      receipt = await contractService.approveEvaluation(id).catch(() => null);
      break;
    case "recommendPromotion":
      receipt = await contractService.recommendPromotion(id).catch(() => null);
      break;
  }

  if (receipt) {
    await prisma.blockchainTransaction.create({
      data: {
        evaluationId: id,
        contractAddress: process.env.SMART_CONTRACT_ADDRESS ?? "",
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        walletAddress: actorId,
        action,
        syncStatus: receipt.status,
      },
    });
  }

  return formatEvaluation(updated);
}

export async function verifyEvaluation(id: string, documentText: string) {
  const evaluation = await prisma.evaluation.findUnique({ where: { id } });
  if (!evaluation) return null;
  const hash = generateSHA256(documentText);
  return {
    valid: hash === evaluation.documentHash,
    storedHash: evaluation.documentHash,
    providedHash: hash,
    blockchainTxHash: evaluation.blockchainTxHash,
  };
}

// ── Format helper ─────────────────────────────────────────────────────────────
function formatEvaluation(e: Record<string, unknown> & { commentEncrypted: string; details?: unknown[] }) {
  const { commentEncrypted, ...rest } = e;
  let comment = "";
  try { comment = decrypt(commentEncrypted); } catch { comment = ""; }
  return { ...rest, comment };
}

export { KPI_INDICATORS };
