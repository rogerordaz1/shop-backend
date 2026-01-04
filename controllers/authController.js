import { validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} from "../config/env.js";
import Token from "../models/token.model.js";

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      message: err.msg,
      field: err.path,
    }));
    return res.status(400).json({ errors: errorMessages });
  }
};

const loginCallback = async (req, res, next) => {
  try {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_ACCESS_SECRET,
      {
        expiresIn: JWT_ACCESS_EXPIRATION,
      }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_REFRESH_SECRET,
      {
        expiresIn: JWT_REFRESH_EXPIRATION,
      }
    );

    const existingToken = await Token.findOne({ userId: user._id });
    if (existingToken) {
      await Token.deleteOne({ userId: user._id });
    }
    const tokenData = {
      userId: user._id,
      accessToken,
      refreshToken,
    };
    await new Token(tokenData).save();

    user.passwordHash = undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const registerCallback = async (req, res, next) => {
  const errorResponse = handleValidationErrors(req, res);
  if (errorResponse) return errorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, phone } = req.body;

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const user = {
      name,
      email,
      phone,
      passwordHash: bcrypt.hashSync(password, 8),
    };

    const users = await User.create([user], { session: session });

    const token = jwt.sign(
      {
        userId: users[0]._id,
      },
      JWT_ACCESS_SECRET,
      {
        expiresIn: JWT_ACCESS_EXPIRATION,
      }
    );

    user.passwordHash = undefined;
    return res.status(201).json({
      susccess: true,
      message: "User registered successfully",
      data: {
        token,
        user: users[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const verifyTokenCallback = async (req, res , next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    const accessToken = await Token.findOne({ accessToken: token });

    if (!accessToken) {
      const error = new Error("Invalid token");
      error.statusCode = 401;
      throw error;
    }

    const tokenData = jwt.decode(accessToken.refreshToken);

    const user = await User.findById(tokenData.userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isValid = jwt.verify(accessToken.refreshToken, JWT_REFRESH_SECRET);

    if (!isValid) {
      const error = new Error("Invalid token");
      error.statusCode = 401;
      throw error;
    }


    return res.status(200).json({ 
      isValid: true,
      success: true,
      message: "Token is valid", 
    });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordCallback = async (req, res) => {
  return res.status(200).json({ message: "Forgot password email sent" });
};

const verifyOtpCallback = async (req, res) => {
  return res.status(200).json({ message: "OTP verified successfully" });
};

const resetPasswordCallback = async (req, res) => {
  return res.status(200).json({ message: "Password reset successful" });
};

export {
  loginCallback,
  registerCallback,
  forgotPasswordCallback,
  verifyOtpCallback,
  resetPasswordCallback,
  verifyTokenCallback
};
