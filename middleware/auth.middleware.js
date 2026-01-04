import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
 
} from "../config/env.js";
import User from "../models/user.model.js";

const authorizeMiddleware = async (req, res, next) => {
  // Example: Check for a valid authentication token
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export default authorizeMiddleware;
