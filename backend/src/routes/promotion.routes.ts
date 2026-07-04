import { Router } from "express";
import multer from "multer";
import {
  listPromotionsController,
  createPromotionController,
  approvePromotionController,
  rejectPromotionController,
  downloadCertificateController,
  verifyPromotionDocumentController,
} from "../controllers/promotion.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { promotionSchema } from "../validation/schemas.js";
import { fail } from "../utils/response.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Hanya file PDF yang diterima"));
    }
    cb(null, true);
  },
});

export const promotionRoutes = Router();
promotionRoutes.use(authMiddleware);

// All roles can list, but listPromotionsController scopes results by role
promotionRoutes.get("/", listPromotionsController);
promotionRoutes.post("/", roleMiddleware(["Manager", "HR"]), validateBody(promotionSchema), createPromotionController);
promotionRoutes.put("/:id/approve", roleMiddleware(["Director"]), approvePromotionController);
promotionRoutes.put("/:id/reject", roleMiddleware(["Director", "HR"]), rejectPromotionController);

// SK decree document — download & tamper-evidence verification
promotionRoutes.get("/:id/certificate", downloadCertificateController);
promotionRoutes.post(
  "/:id/verify-document",
  (req, res, next) => {
    upload.single("document")(req, res, (err) => {
      if (err) return fail(res, err.message || "Gagal mengunggah file", 400);
      next();
    });
  },
  verifyPromotionDocumentController
);
