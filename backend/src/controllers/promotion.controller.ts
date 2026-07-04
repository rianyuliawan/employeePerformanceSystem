import type { Request, Response } from "express";
import {
  listPromotions,
  createPromotion,
  approvePromotion,
  rejectPromotion,
  getPromotionById,
  promotionCertificatePath,
} from "../services/promotion.service.js";
import { getEmployeeIdByUserId } from "../services/employee.service.js";
import { logAudit } from "../services/audit.service.js";
import { generateSHA256 } from "../crypto/hash.service.js";
import { ContractService } from "../blockchain/contract.service.js";
import { ok, fail } from "../utils/response.js";
import type { AuthUser } from "../middlewares/auth.middleware.js";

const contractService = new ContractService();

async function canAccessPromotion(
  user: AuthUser,
  promotion: { employeeId: string; requestedById: string }
): Promise<boolean> {
  if (user.role === "HR" || user.role === "Director") return true;
  if (user.role === "Manager") return promotion.requestedById === user.id;
  if (user.role === "Employee") {
    const employeeId = await getEmployeeIdByUserId(user.id);
    return employeeId === promotion.employeeId;
  }
  return false;
}

export async function listPromotionsController(req: Request, res: Response) {
  const user = req.user!;
  const { status } = req.query;

  if (user.role === "Employee") {
    const employeeId = await getEmployeeIdByUserId(user.id);
    if (!employeeId) return ok(res, "Promotions loaded", []);
    return ok(res, "Promotions loaded", await listPromotions({ status: status as string, employeeId }));
  }

  if (user.role === "Manager") {
    const data = await listPromotions({ status: status as string, requestedById: user.id });
    return ok(res, "Promotions loaded", data);
  }

  // HR & Director see all, optionally narrowed by employeeId
  const { employeeId } = req.query;
  const data = await listPromotions({ status: status as string, employeeId: employeeId as string });
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
  await logAudit({
    userId: user.id,
    activity: "create_promotion",
    detail: `Created promotion ${data.id} for employee ${employeeId} -> position ${targetPositionId}`,
    ipAddress: req.ip,
  });
  return ok(res, "Promotion request created", data, 201);
}

export async function approvePromotionController(req: Request, res: Response) {
  const user = req.user!;
  const data = await approvePromotion(req.params.id, user.id);
  if (!data) return fail(res, "Promotion not found", 404);
  await logAudit({ userId: user.id, activity: "approve_promotion", detail: req.params.id, ipAddress: req.ip });
  return ok(res, "Promotion approved", data);
}

export async function rejectPromotionController(req: Request, res: Response) {
  const user = req.user!;
  const data = await rejectPromotion(req.params.id, user.id);
  if (!data) return fail(res, "Promotion not found", 404);
  await logAudit({ userId: user.id, activity: "reject_promotion", detail: req.params.id, ipAddress: req.ip });
  return ok(res, "Promotion rejected", data);
}

/** GET /promotions/:id/certificate — download the generated SK decree PDF */
export async function downloadCertificateController(req: Request, res: Response) {
  const user = req.user!;
  const promotion = await getPromotionById(req.params.id);
  if (!promotion) return fail(res, "Promotion not found", 404);
  if (!(await canAccessPromotion(user, promotion))) return fail(res, "Forbidden", 403);
  if (!promotion.documentPath) {
    return fail(res, "Dokumen SK belum tersedia — promosi ini belum disetujui.", 404);
  }
  const fileName = `SK-${promotion.skNumber ?? promotion.id}.pdf`.replace(/\//g, "-");
  return res.download(promotionCertificatePath(promotion.id), fileName, (err) => {
    if (err && !res.headersSent) fail(res, "Gagal mengunduh dokumen", 500);
  });
}

/** POST /promotions/:id/verify-document — upload a PDF and check it against DB + blockchain */
export async function verifyPromotionDocumentController(req: Request, res: Response) {
  const promotion = await getPromotionById(req.params.id);
  if (!promotion) return fail(res, "Promotion not found", 404);
  if (!promotion.promotionHash) {
    return fail(res, "Promosi ini belum disetujui, belum ada dokumen untuk diverifikasi.", 400);
  }

  const file = (req as Request & { file?: { buffer: Buffer } }).file;
  if (!file) return fail(res, "File PDF wajib diunggah (field 'document').", 400);

  const uploadedHash = generateSHA256(file.buffer);
  const dbHash = promotion.promotionHash;
  const matchesDb = uploadedHash === dbHash;

  const onChain = await contractService.getPromotionOnChain(promotion.id);
  let onChainHash: string | null = null;
  if (onChain?.promotionHash) {
    const raw = onChain.promotionHash as string;
    onChainHash = raw.startsWith("0x") ? raw.slice(2) : raw;
  }
  const matchesOnChain = onChainHash !== null ? uploadedHash === onChainHash : null;

  let verdict: string;
  if (matchesDb && matchesOnChain !== false) {
    verdict = onChainHash
      ? "ASLI — dokumen cocok dengan database dan blockchain, belum pernah diubah."
      : "COCOK dengan database (blockchain tidak dapat diakses saat ini untuk pengecekan tambahan).";
  } else if (matchesDb && matchesOnChain === false) {
    verdict = "PERINGATAN — dokumen cocok dengan database, tapi TIDAK cocok dengan catatan di blockchain. Kemungkinan data di database telah diubah tanpa melalui sistem.";
  } else {
    verdict = "TIDAK COCOK — dokumen ini kemungkinan telah diubah dari versi aslinya.";
  }

  return ok(res, "Verifikasi selesai", {
    uploadedHash,
    dbHash,
    onChainHash,
    matchesDb,
    matchesOnChain,
    verdict,
  });
}
