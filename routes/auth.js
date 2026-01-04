import express from "express";

import {
  loginCallback,
  registerCallback,
  forgotPasswordCallback,
  verifyOtpCallback,
  resetPasswordCallback,
  verifyTokenCallback,
} from "../controllers/authController.js";

import { validateRegisteredUser } from "../utils/validations.js";

const authRouter = express.Router();

// Define your authentication routes here
authRouter.post("/login", loginCallback);

authRouter.post("/register", validateRegisteredUser, registerCallback);

authRouter.get("/verify-token", verifyTokenCallback);

authRouter.post("/forgot-password", forgotPasswordCallback);

authRouter.post("/verify-otp", verifyOtpCallback);

authRouter.post("/reset-password", resetPasswordCallback);

export default authRouter;
