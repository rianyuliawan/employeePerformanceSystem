import type { Request, Response } from "express";
import { login } from "../services/auth.service.js";
import {
  generateNonce,
  walletLogin,
  isWalletRegistered,
  registerWallet,
  getRegisteredWallets,
} from "../services/wallet-auth.service.js";
import { fail, ok } from "../utils/response.js";

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body.email, req.body.password);
  if (!result) return fail(res, "Invalid email or password", 401);
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
  if ("error" in result) return fail(res, result.error, 401);
  return ok(res, "Wallet login success", result);
}

/** POST /auth/assign-wallet  { userId, walletAddress } — HR/Director only */
export async function assignWalletController(req: Request, res: Response) {
  const { userId, walletAddress } = req.body;
  if (!userId || !walletAddress) return fail(res, "userId and walletAddress required", 400);
  const updated = await registerWallet(walletAddress, userId);
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
