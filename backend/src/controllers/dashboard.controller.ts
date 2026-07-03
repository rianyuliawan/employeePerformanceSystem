import type { Request, Response } from "express";
import { memoryRepository } from "../repositories/memory.repository.js";
import { ok } from "../utils/response.js";

export function dashboardController(_req: Request, res: Response) {
  return ok(res, "Dashboard loaded", memoryRepository.dashboard());
}

