import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getDashboard,
  getProfile,
  updateProfile,
  getMyAnalyse
} from "../controllers/userController.js";
import { verifySession } from "../middlewares/sessionMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/dashboard", verifySession, getDashboard);
router.get("/analyses/my-analyses", verifySession, getMyAnalyse);
router.get("/profile", verifySession, getProfile);
router.put("/profile", verifySession, updateProfile);

export default router;
