import type { Request, Response } from "express";
import {
  listPromotions,
  createPromotion,
  approvePromotion,
  rejectPromotion,
} from "../services/promotion.service.js";
import { ok, fail } from "../utils/response.js";

export async function listPromotionsController(req: Request, res: Response) {
  const { status, employeeId } = req.query;
  const data = await listPromotions({
    status: status as string,
    employeeId: employeeId as string,
  });
  return ok(res, "Promotions loaded", data);
}

export async function createPromotionController(req: Request, res: Response) {
  const user = req.user!;
  const { evaluationId, employeeId, targetPositionId, reason } = req.body;
  const data = await createPromotion({
    evaluationId,
    employeeId,
    targetPositionId,
    reason,
    requestedById: user.id,
  });
  return ok(res, "Promotion request created", data, 201);
}

export async function approvePromotionController(req: Request, res: Response) {
  const user = req.user!;
  const data = await approvePromotion(req.params.id, user.id);
  if (!data) return fail(res, "Promotion not found", 404);
  return ok(res, "Promotion approved", data);
}

export async function rejectPromotionController(req: Request, res: Response) {
  const user = req.user!;
  const data = await rejectPromotion(req.params.id, user.id);
  if (!data) return fail(res, "Promotion not found", 404);
  return ok(res, "Promotion rejected", data);
}
