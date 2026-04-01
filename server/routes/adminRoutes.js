 import express from "express";
import { getStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

//  ONLY ADMIN CAN ACCESS
router.get("/stats", protect, isAdmin, getStats);

export default router;