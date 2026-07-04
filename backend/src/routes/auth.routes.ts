import { Router } from "express";
import {
  loginController,
  profileController,
  nonceController,
  walletLoginController,
  assignWalletController,
  listWalletsController,
  walletCheckController,
  changePasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { loginSchema, walletLoginSchema, changePasswordSchema, resetPasswordSchema } from "../validation/schemas.js";

export const authRoutes = Router();

// ── Email + password login ─────────────────────────────────────────────────
authRoutes.post("/login", validateBody(loginSchema), loginController);
authRoutes.post("/logout", authMiddleware, (_req, res) =>
  res.json({ success: true, message: "Logout success", data: null })
);
authRoutes.get("/profile", authMiddleware, profileController);

// ── MetaMask / Wallet login ────────────────────────────────────────────────
authRoutes.get("/nonce", nonceController);
authRoutes.get("/wallet-check", walletCheckController);
authRoutes.post("/wallet-login", validateBody(walletLoginSchema), walletLoginController);

// ── Wallet management (requires JWT login) ────────────────────────────────
authRoutes.post("/assign-wallet", authMiddleware, roleMiddleware(["HR", "Director"]), assignWalletController);
authRoutes.get("/wallets", authMiddleware, roleMiddleware(["HR", "Director"]), listWalletsController);

// ── Password management ──────────────────────────────────────────────────
authRoutes.put("/change-password", authMiddleware, validateBody(changePasswordSchema), changePasswordController);
authRoutes.put(
  "/reset-password",
  authMiddleware,
  roleMiddleware(["HR", "Director"]),
  validateBody(resetPasswordSchema),
  resetPasswordController
);

