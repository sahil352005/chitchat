import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes
router.post("/send", isAuthenticated, sendMessage);
router.get("/:userId", isAuthenticated, getMessages);

export default router;
