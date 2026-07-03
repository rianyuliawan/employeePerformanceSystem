import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ok } from "../utils/response.js";
import { prisma } from "../database/prisma.js";

export const auditRoutes = Router();
auditRoutes.use(authMiddleware);
auditRoutes.use(roleMiddleware(["HR", "Director"]));

auditRoutes.get("/", async (_req, res) => {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return ok(res, "Audit logs loaded", logs);
});
