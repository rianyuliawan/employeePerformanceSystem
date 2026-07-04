import { prisma } from "../database/prisma.js";

// Audit logging is a side-effect, not a business requirement — a failure to
// write a log entry must never break the request that triggered it.
export async function logAudit(params: {
  userId?: string | null;
  activity: string;
  detail?: string;
  ipAddress?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        activity: params.activity,
        detail: params.detail ?? null,
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
