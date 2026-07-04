import { prisma } from "../database/prisma.js";
import { encrypt, decrypt } from "../crypto/aes.service.js";
import { generateSHA256 } from "../crypto/hash.service.js";
import { ContractService } from "../blockchain/contract.service.js";
import type { Evaluation, EvaluationStatus } from "@prisma/client";

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
  let evaluation = await prisma.evaluation.create({
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

  // Awaited (not fire-and-forget): later actions on this evaluation
  // (review/approve/recommend) call the contract expecting this submission
  // to already exist on-chain — if we returned before it landed, those
  // calls would revert with "Evaluation not found".
  try {
    const receipt = await contractService.submitEvaluation(evaluation.id, data.employeeId, documentHash);
    evaluation = await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: {
        blockchainStatus: receipt.status,
        blockchainTxHash: receipt.transactionHash,
        blockchainBlockNum: receipt.blockNumber,
      },
      include: { details: true, employee: { include: { user: true } }, manager: true },
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
  } catch (err) {
    console.error(`submitEvaluation on-chain call failed for evaluation ${evaluation.id}:`, err);
    evaluation = await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: { blockchainStatus: "Failed" },
      include: { details: true, employee: { include: { user: true } }, manager: true },
    });
  }

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
  const onChainError = (err: unknown) => {
    console.error(`${action} on-chain call failed for evaluation ${id}:`, err);
    return null;
  };
  let receipt;
  switch (action) {
    case "review":
      receipt = await contractService.reviewEvaluation(id).catch(onChainError);
      break;
    case "approve":
      receipt = await contractService.approveEvaluation(id).catch(onChainError);
      break;
    case "recommendPromotion":
      receipt = await contractService.recommendPromotion(id).catch(onChainError);
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
function formatEvaluation<T extends Evaluation & Record<string, unknown>>(e: T) {
  const { commentEncrypted, ...rest } = e;
  let comment = "";
  try { comment = decrypt(commentEncrypted); } catch { comment = ""; }
  return { ...rest, comment };
}

export { KPI_INDICATORS };
