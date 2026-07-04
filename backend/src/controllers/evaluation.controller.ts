import type { Request, Response } from "express";
import {
  listEvaluations,
  getEvaluation,
  createEvaluation,
  updateEvaluationStatus,
  verifyEvaluation,
} from "../services/evaluation.service.js";
import { getEmployeeIdByUserId } from "../services/employee.service.js";
import { logAudit } from "../services/audit.service.js";
import { prisma } from "../database/prisma.js";
import { ok, fail } from "../utils/response.js";

export async function listEvaluationsController(req: Request, res: Response) {
  const user = req.user!;

  if (user.role === "Manager") {
    return ok(res, "Evaluations loaded", await listEvaluations({ managerId: user.id }));
  }

  if (user.role === "Employee") {
    const employeeId = await getEmployeeIdByUserId(user.id);
    if (!employeeId) return ok(res, "Evaluations loaded", []);
    return ok(res, "Evaluations loaded", await listEvaluations({ employeeId }));
  }

  // HR & Director see all
  return ok(res, "Evaluations loaded", await listEvaluations());
}

export async function getEvaluationController(req: Request, res: Response) {
  const user = req.user!;
  const data = await getEvaluation(req.params.id);
  if (!data) return fail(res, "Evaluation not found", 404);

  if (user.role === "Employee") {
    const employeeId = await getEmployeeIdByUserId(user.id);
    if (!employeeId || data.employeeId !== employeeId) return fail(res, "Forbidden", 403);
  } else if (user.role === "Manager" && data.managerId !== user.id) {
    return fail(res, "Forbidden", 403);
  }

  return ok(res, "Evaluation loaded", data);
}

export async function createEvaluationController(req: Request, res: Response) {
  try {
    const user = req.user!;
    let { employeeId, periodId, scores, comment } = req.body;

    // Resolve to the currently active period whenever the given periodId
    // is missing or doesn't correspond to a real EvaluationPeriod
    const period = periodId ? await prisma.evaluationPeriod.findUnique({ where: { id: periodId } }) : null;
    if (!period) {
      const activePeriod = await prisma.evaluationPeriod.findFirst({ where: { isActive: true } });
      if (activePeriod) periodId = activePeriod.id;
    }

    const data = await createEvaluation({
      employeeId,
      managerId: user.id,
      periodId,
      scores,
      comment,
    });
    await logAudit({
      userId: user.id,
      activity: "create_evaluation",
      detail: `Created evaluation ${data.id} for employee ${employeeId}`,
      ipAddress: req.ip,
    });
    return ok(res, "Evaluation submitted", data, 201);
  } catch (error: any) {
    console.error("Error creating evaluation:", error);
    return fail(res, error.message || "Internal Server Error", 500);
  }
}

export async function reviewEvaluationController(req: Request, res: Response) {
  const user = req.user!;
  const data = await updateEvaluationStatus(req.params.id, "Reviewed", "review", user.id);
  if (!data) return fail(res, "Evaluation not found", 404);
  await logAudit({ userId: user.id, activity: "review_evaluation", detail: req.params.id, ipAddress: req.ip });
  return ok(res, "Evaluation reviewed", data);
}

export async function approveEvaluationController(req: Request, res: Response) {
  const user = req.user!;
  const data = await updateEvaluationStatus(req.params.id, "Approved", "approve", user.id);
  if (!data) return fail(res, "Evaluation not found", 404);
  await logAudit({ userId: user.id, activity: "approve_evaluation", detail: req.params.id, ipAddress: req.ip });
  return ok(res, "Evaluation approved", data);
}

export async function recommendPromotionController(req: Request, res: Response) {
  const user = req.user!;
  const data = await updateEvaluationStatus(req.params.id, "PromotionRecommended", "recommendPromotion", user.id);
  if (!data) return fail(res, "Evaluation not found", 404);
  await logAudit({ userId: user.id, activity: "recommend_promotion", detail: req.params.id, ipAddress: req.ip });
  return ok(res, "Promotion recommended", data);
}

export async function verifyEvaluationController(req: Request, res: Response) {
  const { documentText } = req.body;
  const data = await verifyEvaluation(req.params.id, documentText);
  if (!data) return fail(res, "Evaluation not found", 404);
  return ok(res, "Document verified", data);
}
