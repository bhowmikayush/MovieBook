 import express from "express";
import {
  addShow,
  getShows,          // ✅ NEW (get all shows)
  getShowsByMovie,
  getSingleShow,
  deleteShow,
  updateShow,
} from "../controllers/showController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

//  ADD SHOW (ADMIN ONLY)
router.post("/add", protect, isAdmin, addShow);

//  GET ALL SHOWS (for Admin panel)
router.get("/", getShows);

//  GET SHOWS BY MOVIE (for MovieDetails page)
router.get("/movie/:movieId", getShowsByMovie);

//  GET SINGLE SHOW (Seat Layout)
router.get("/single/:id", getSingleShow);

//  UPDATE
router.put("/:id", updateShow);

//  DELETE
router.delete("/:id", deleteShow);

export default router;