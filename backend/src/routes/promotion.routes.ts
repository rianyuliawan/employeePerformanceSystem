import { Router } from "express";
import {
  listPromotionsController,
  createPromotionController,
  approvePromotionController,
  rejectPromotionController,
} from "../controllers/promotion.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";

export const promotionRoutes = Router();
promotionRoutes.use(authMiddleware);

promotionRoutes.get("/", listPromotionsController);
promotionRoutes.post("/", roleMiddleware(["Manager", "HR"]), createPromotionController);
promotionRoutes.put("/:id/approve", roleMiddleware(["Director"]), approvePromotionController);
promotionRoutes.put("/:id/reject", roleMiddleware(["Director", "HR"]), rejectPromotionController);
