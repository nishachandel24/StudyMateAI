import express from "express";

import {
  signup,
  login,
  verifyEmail,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.get("/me", authMiddleware, getMe);

export default router;