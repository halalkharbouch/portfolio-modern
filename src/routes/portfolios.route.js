import express from "express";
import {
  getPortfolios,
  uploadProject,
} from "../controllers/portfolios.controller.js";
import multer from "multer";
import {
  authenticateToken,
  authorizeRole,
  limiter,
} from "../middleware/auth.middleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getPortfolios);
router.post(
  "/add-project",
  authenticateToken,
  authorizeRole(["admin"]),
  limiter,
  upload.array("projectImgUrls", 10),
  uploadProject
);

export default router;
