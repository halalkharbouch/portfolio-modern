import express from "express";
import {
  login,
  register,
  registerUser,
} from "../controllers/auth.controller.js";
import {
  authenticateToken,
  authorizeRole,
  limiter,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post(
  "/register-user",
  authenticateToken,
  authorizeRole(["admin"]),
  limiter,
  registerUser
);

export default router;
