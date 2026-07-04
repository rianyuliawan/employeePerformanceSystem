import type { Request, Response } from "express";
import { login, changePassword, resetPassword } from "../services/auth.service.js";
import {
  generateNonce,
  walletLogin,
  isWalletRegistered,
  registerWallet,
  getRegisteredWallets,
} from "../services/wallet-auth.service.js";
import { logAudit } from "../services/audit.service.js";
import { fail, ok } from "../utils/response.js";

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body.email, req.body.password);
  if (!result) {
    await logAudit({ activity: "login_failed", detail: req.body.email, ipAddress: req.ip });
    return fail(res, "Invalid email or password", 401);
  }
  await logAudit({ userId: result.user.id, activity: "login_email", ipAddress: req.ip });
  return ok(res, "Login success", result);
}

export function profileController(req: Request, res: Response) {
  return ok(res, "Profile loaded", req.user);
}

/** GET /auth/nonce?address=0x... */
export async function nonceController(req: Request, res: Response) {
  const address = req.query.address as string;
  if (!address || !address.startsWith("0x")) {
    return fail(res, "Valid wallet address (0x...) required", 400);
  }
  const nonce = generateNonce(address);
  const registered = await isWalletRegistered(address);
  return ok(res, "Nonce generated", {
    nonce,
    address,
    isRegistered: registered,
    hint: registered
      ? "Wallet terdaftar. Silakan tanda tangani pesan."
      : "Wallet belum terdaftar. Hubungi HR untuk mendaftarkan wallet ini.",
  });
}

/** GET /auth/wallet-check?address=0x... */
export async function walletCheckController(req: Request, res: Response) {
  const address = req.query.address as string;
  if (!address || !address.startsWith("0x")) {
    return fail(res, "Valid wallet address required", 400);
  }
  const registered = await isWalletRegistered(address);
  return ok(res, registered ? "Wallet terdaftar" : "Wallet belum terdaftar", {
    address,
    isRegistered: registered,
  });
}

/** POST /auth/wallet-login  { address, signature } */
export async function walletLoginController(req: Request, res: Response) {
  const { address, signature } = req.body;
  if (!address || !signature) return fail(res, "address and signature required", 400);
  const result = await walletLogin(address, signature);
  if ("error" in result) {
    await logAudit({ activity: "login_wallet_failed", detail: `${address}: ${result.error}`, ipAddress: req.ip });
    return fail(res, result.error, 401);
  }
  await logAudit({ userId: result.user.id, activity: "login_wallet", detail: address, ipAddress: req.ip });
  return ok(res, "Wallet login success", result);
}

/** POST /auth/assign-wallet  { userId, walletAddress } — HR/Director only */
export async function assignWalletController(req: Request, res: Response) {
  const { userId, walletAddress } = req.body;
  if (!userId || !walletAddress) return fail(res, "userId and walletAddress required", 400);
  const updated = await registerWallet(walletAddress, userId);
  await logAudit({
    userId: req.user!.id,
    activity: "assign_wallet",
    detail: `Assigned ${walletAddress} to user ${updated.id} (${updated.name})`,
    ipAddress: req.ip,
  });
  return ok(res, "Wallet assigned to user", {
    userId: updated.id,
    name: updated.name,
    walletAddress: updated.walletAddress,
  });
}

/** GET /auth/wallets — HR/Director only */
export async function listWalletsController(_req: Request, res: Response) {
  return ok(res, "Registered wallets", await getRegisteredWallets());
}

/** PUT /auth/change-password  { currentPassword, newPassword } — any logged-in user */
export async function changePasswordController(req: Request, res: Response) {
  const user = req.user!;
  const { currentPassword, newPassword } = req.body;
  await changePassword(user.id, currentPassword, newPassword);
  await logAudit({ userId: user.id, activity: "change_password", ipAddress: req.ip });
  return ok(res, "Password berhasil diubah", null);
}

/** PUT /auth/reset-password  { userId, newPassword } — HR/Director only */
export async function resetPasswordController(req: Request, res: Response) {
  const actor = req.user!;
  const { userId, newPassword } = req.body;
  const target = await resetPassword(userId, newPassword);
  await logAudit({
    userId: actor.id,
    activity: "reset_password",
    detail: `Reset password for user ${userId} (${target.email})`,
    ipAddress: req.ip,
  });
  return ok(res, `Password untuk ${target.name} berhasil di-reset`, null);
}
