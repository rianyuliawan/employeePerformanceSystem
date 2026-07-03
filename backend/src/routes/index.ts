import { Router } from "express";
import { auditRoutes } from "./audit.routes.js";
import { authRoutes } from "./auth.routes.js";
import { blockchainRoutes } from "./blockchain.routes.js";
import { dashboardRoutes } from "./dashboard.routes.js";
import { employeeRoutes } from "./employee.routes.js";
import { evaluationRoutes } from "./evaluation.routes.js";
import { promotionRoutes } from "./promotion.routes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/employees", employeeRoutes);
apiRoutes.use("/evaluations", evaluationRoutes);
apiRoutes.use("/promotions", promotionRoutes);
apiRoutes.use("/blockchain", blockchainRoutes);
apiRoutes.use("/dashboard", dashboardRoutes);
apiRoutes.use("/audit-logs", auditRoutes);

