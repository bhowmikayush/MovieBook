import express from "express";
import { getAllUsers, deleteUser, updateUserRole } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

//  Only admin can manage users
router.get("/", protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);
router.put("/:id", protect, isAdmin, updateUserRole);

export default router;