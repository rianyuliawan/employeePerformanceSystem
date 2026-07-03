import { Router } from "express";
import {
  listEvaluationsController,
  getEvaluationController,
  createEvaluationController,
  reviewEvaluationController,
  approveEvaluationController,
  recommendPromotionController,
  verifyEvaluationController,
} from "../controllers/evaluation.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { evaluationSchema } from "../validation/schemas.js";

export const evaluationRoutes = Router();
evaluationRoutes.use(authMiddleware);

// All roles can list/view
evaluationRoutes.get("/", listEvaluationsController);
evaluationRoutes.get("/:id", getEvaluationController);

// Manager: create evaluation
evaluationRoutes.post("/", roleMiddleware(["Manager"]), validateBody(evaluationSchema), createEvaluationController);

// HR: review & approve
evaluationRoutes.put("/:id/review", roleMiddleware(["HR"]), reviewEvaluationController);
evaluationRoutes.put("/:id/approve", roleMiddleware(["HR"]), approveEvaluationController);

// Manager: recommend promotion (after evaluation is Approved)
evaluationRoutes.put("/:id/recommend-promotion", roleMiddleware(["Manager"]), recommendPromotionController);

// Any authenticated: verify document
evaluationRoutes.post("/:id/verify", verifyEvaluationController);
