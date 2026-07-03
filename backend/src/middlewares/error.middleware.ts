import type { ErrorRequestHandler } from "express";
import { fail } from "../utils/response.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = Number(error.status ?? 500);
  return fail(res, error.message ?? "Internal Server Error", status);
};

