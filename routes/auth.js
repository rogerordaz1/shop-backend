import express from "express";

import {
  loginCallback,
  registerCallback,
  forgotPasswordCallback,
  verifyOtpCallback,
  resetPasswordCallback,
} from "../controllers/authController.js";

import { validateRegisteredUser } from "../utils/validations.js";

const authRouter = express.Router();

// Define your authentication routes here
const login = authRouter.post("/login", loginCallback);

const register = authRouter.post("/register", validateRegisteredUser, registerCallback);

const forgotPassword = authRouter.post(
  "/forgot-password",
  forgotPasswordCallback
);

const verifyOtp = authRouter.post("/verify-otp", validateRegisteredUser, verifyOtpCallback);

const resetPassword = authRouter.post("/reset-password", resetPasswordCallback);

export default authRouter;
