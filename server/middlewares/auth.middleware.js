import jwt from "jsonwebtoken";
import { getUserById } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again"
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token, please login again"
      });
    }
    next(error);
  }
};