import express from "express";
import {
  registerUser,
  loginUser,
  getDashboard,
  forgotPassword,
  getUserProfile,
  updateUserProfile,
  resetPassword
} from "../controllers/usercontroller.js";
import userAuth from "../middlewares/auth.js"; // For protected routes

const userRouter = express.Router();

// Signup: /api/auth/signup
userRouter.post("/signup", registerUser);

// Login: /api/auth/login
userRouter.post("/login", loginUser);

// Forgot Password: /forgot-password
userRouter.post("/forgot-password", forgotPassword);

// Dashboard: /api/auth/dashboard
userRouter.get("/dashboard", userAuth, getDashboard);

// Get User Profile: /api/auth/profile/:id
userRouter.get("/profile/:id", userAuth, getUserProfile);

// Update User Profile: /api/auth/profile/:id
userRouter.put("/profile/:id", userAuth, updateUserProfile);

userRouter.put("/reset-password/:token", resetPassword);


export default userRouter;