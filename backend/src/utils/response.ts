import type { Response } from "express";

export function ok(res: Response, message: string, data: unknown = null, status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function fail(res: Response, message: string, status = 400, errors: unknown = null) {
  return res.status(status).json({ success: false, message, errors });
}

