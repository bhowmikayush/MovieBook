 import express from "express";
import {
  addShow,
  getShows,
  getSingleShow,
  deleteShow,
} from "../controllers/showController.js";
import { getMyBookings } from "../controllers/bookingController.js";


import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.get("/", protect, getMyBookings);

//  Admin
router.post("/add", protect, isAdmin, addShow);
router.delete("/:id", protect, isAdmin, deleteShow);

//  Public
router.get("/movie/:movieId", getShows);
router.get("/single/:id", getSingleShow);

export default router;