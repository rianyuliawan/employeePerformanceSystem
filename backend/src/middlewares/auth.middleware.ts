import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { fail } from "../utils/response.js";

export type Role = "HR" | "Manager" | "Director" | "Employee";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  employeeId?: string;
  walletAddress?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return fail(res, "Unauthorized", 401);

  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthUser;
    return next();
  } catch {
    return fail(res, "Invalid token", 401);
  }
}

export function roleMiddleware(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return fail(res, "Unauthorized", 401);
    if (!roles.includes(req.user.role)) return fail(res, "Forbidden", 403);
    return next();
  };
}

