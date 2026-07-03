import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { fail } from "../utils/response.js";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return fail(res, "Validation Error", 422, result.error.flatten());
    req.body = result.data;
    return next();
  };
}

