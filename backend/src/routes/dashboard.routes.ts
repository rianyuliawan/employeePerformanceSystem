import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ok } from "../utils/response.js";
import { prisma } from "../database/prisma.js";

export const dashboardRoutes = Router();
dashboardRoutes.use(authMiddleware);

dashboardRoutes.get("/", async (req, res) => {
  const user = req.user!;

  const evaluationWhere: Prisma.EvaluationWhereInput | undefined =
    user.role === "Manager" ? { managerId: user.id } :
    user.role === "Employee" ? { employee: { userId: user.id } } :
    undefined;

  const [totalEmployee, totalEvaluation, pendingPromotion, latestTxs] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.evaluation.count({ where: evaluationWhere }),
    user.role === "Director" ? prisma.promotion.count({ where: { status: "Pending" } }) :
    user.role === "HR" ? prisma.evaluation.count({ where: { status: "Submitted" } }) :
    Promise.resolve(0),
    prisma.blockchainTransaction.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { evaluation: { select: { id: true } } },
    }),
  ]);

  return ok(res, "Dashboard loaded", {
    totalEmployee,
    totalEvaluation,
    pendingPromotion,
    latestTransaction: latestTxs.map((t) => ({
      evaluationId: t.evaluationId,
      transactionHash: t.transactionHash,
      action: t.action,
      walletAddress: t.walletAddress,
      network: t.network,
      status: t.syncStatus,
      createdAt: t.createdAt,
    })),
  });
});
