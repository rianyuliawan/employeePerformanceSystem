import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma.js";
import { env } from "../config/env.js";
import type { AuthUser, Role } from "../middlewares/auth.middleware.js";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  const payload: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    walletAddress: user.walletAddress ?? undefined,
  };

  return {
    accessToken: jwt.sign(payload, env.jwtSecret, { expiresIn: "8h" }),
    user: payload,
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, walletAddress: true, isActive: true },
  });
  return user;
}
