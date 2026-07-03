import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ok } from "../utils/response.js";
import { prisma } from "../database/prisma.js";

export const blockchainRoutes = Router();
blockchainRoutes.use(authMiddleware);

// List all blockchain transactions
blockchainRoutes.get("/transactions", async (req, res) => {
  const { evaluationId } = req.query;
  const txs = await prisma.blockchainTransaction.findMany({
    where: evaluationId ? { evaluationId: String(evaluationId) } : undefined,
    include: {
      evaluation: { select: { id: true, totalScore: true } },
      promotion: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return ok(res, "Blockchain transactions loaded", txs);
});

// Get on-chain evaluation data
blockchainRoutes.get("/evaluation/:evaluationId", async (req, res) => {
  const { evaluationId } = req.params;
  const tx = await prisma.blockchainTransaction.findFirst({
    where: { evaluationId, action: "submitEvaluation" },
  });
  return ok(res, "On-chain data", {
    evaluationId,
    transactionHash: tx?.transactionHash,
    contractAddress: process.env.SMART_CONTRACT_ADDRESS,
    explorerUrl: tx?.transactionHash
      ? `https://sepolia.etherscan.io/tx/${tx.transactionHash}`
      : null,
    network: "sepolia",
  });
});
