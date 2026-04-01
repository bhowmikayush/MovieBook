import express from "express";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router();

// Google login
router.post("/google", googleAuth);

export default router;