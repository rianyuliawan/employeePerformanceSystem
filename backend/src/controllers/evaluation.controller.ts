import type { Request, Response } from "express";
import {
  listEvaluations,
  getEvaluation,
  createEvaluation,
  updateEvaluationStatus,
  verifyEvaluation,
} from "../services/evaluation.service.js";
import { ok, fail } from "../utils/response.js";

export async function listEvaluationsController(req: Request, res: Response) {
  const user = req.user!;
  const filter =
    user.role === "Employee"
      ? { employeeId: user.id }  // employees only see their own via user id mapping
      : user.role === "Manager"
      ? { managerId: user.id }
      : undefined; // HR & Director see all
  const data = await listEvaluations(filter);
  return ok(res, "Evaluations loaded", data);
}

export async function getEvaluationController(req: Request, res: Response) {
  const data = await getEvaluation(req.params.id);
  if (!data) return fail(res, "Evaluation not found", 404);
  return ok(res, "Evaluation loaded", data);
}

export async function createEvaluationController(req: Request, res: Response) {
  const user = req.user!;
  const { employeeId, periodId, scores, comment } = req.body;
  const data = await createEvaluation({
    employeeId,
    managerId: user.id,
    periodId,
    scores,
    comment,
  });
  return ok(res, "Evaluation submitted", data, 201);
}

export async function reviewEvaluationController(req: Request, res: Response) {
  const user = req.user!;
  const data = await updateEvaluationStatus(req.params.id, "Reviewed", "review", user.id);
  if (!data) return fail(res, "Evaluation not found", 404);
  return ok(res, "Evaluation reviewed", data);
}

export async function approveEvaluationController(req: Request, res: Response) {
  const user = req.user!;
  const data = await updateEvaluationStatus(req.params.id, "Approved", "approve", user.id);
  if (!data) return fail(res, "Evaluation not found", 404);
  return ok(res, "Evaluation approved", data);
}

export async function recommendPromotionController(req: Request, res: Response) {
  const user = req.user!;
  const data = await updateEvaluationStatus(req.params.id, "PromotionRecommended", "recommendPromotion", user.id);
  if (!data) return fail(res, "Evaluation not found", 404);
  return ok(res, "Promotion recommended", data);
}

export async function verifyEvaluationController(req: Request, res: Response) {
  const { documentText } = req.body;
  const data = await verifyEvaluation(req.params.id, documentText);
  if (!data) return fail(res, "Evaluation not found", 404);
  return ok(res, "Document verified", data);
}
