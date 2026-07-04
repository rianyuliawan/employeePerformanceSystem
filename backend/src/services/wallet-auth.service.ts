import crypto from "node:crypto";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma.js";
import { env } from "../config/env.js";
import type { AuthUser, Role } from "../middlewares/auth.middleware.js";

// In-memory nonce store (use Redis in production)
const nonceStore = new Map<string, { nonce: string; expiresAt: number }>();

export function generateNonce(address: string): string {
  const nonce = [
    "Sign this message to login to EPS.",
    `Nonce: ${crypto.randomBytes(16).toString("hex")}`,
    `Timestamp: ${Date.now()}`,
    `Address: ${address.toLowerCase()}`,
  ].join("\n");
  nonceStore.set(address.toLowerCase(), { nonce, expiresAt: Date.now() + 5 * 60 * 1000 });
  return nonce;
}

export type WalletLoginResult = { error: string } | { accessToken: string; user: AuthUser };

export async function walletLogin(address: string, signature: string): Promise<WalletLoginResult> {
  const addr = address.toLowerCase();
  const entry = nonceStore.get(addr);
  if (!entry) return { error: "Nonce tidak ditemukan. Minta nonce baru." };
  if (Date.now() > entry.expiresAt) {
    nonceStore.delete(addr);
    return { error: "Nonce kedaluwarsa. Minta nonce baru." };
  }

  let recovered: string;
  try {
    recovered = ethers.verifyMessage(entry.nonce, signature);
  } catch {
    return { error: "Signature tidak valid." };
  }

  if (recovered.toLowerCase() !== addr) {
    return { error: "Signature tidak cocok dengan wallet address." };
  }

  nonceStore.delete(addr);

  // Lookup from PostgreSQL by wallet_address (case-insensitive)
  const user = await prisma.user.findFirst({
    where: { walletAddress: { equals: addr, mode: "insensitive" } },
  });
  if (!user || !user.isActive) {
    return { error: `Wallet ${address} belum terdaftar. HR perlu assign wallet ini ke user.` };
  }

  const payload: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    walletAddress: user.walletAddress ?? undefined,
  };

  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: "8h" });
  return { accessToken: token, user: payload };
}

export async function isWalletRegistered(address: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { walletAddress: { equals: address, mode: "insensitive" } },
  });
  return count > 0;
}

export async function registerWallet(address: string, userId: string) {
  return prisma.user.update({ where: { id: userId }, data: { walletAddress: address } });
}

export async function getRegisteredWallets() {
  return prisma.user.findMany({
    where: { walletAddress: { not: null } },
    select: { id: true, name: true, email: true, role: true, walletAddress: true },
  });
}
