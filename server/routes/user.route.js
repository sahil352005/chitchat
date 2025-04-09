import express from "express";
import { register, login, getProfile, getOtherUsersList } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", isAuthenticated, getProfile);
router.get("/users", isAuthenticated, getOtherUsersList);

export default router;
