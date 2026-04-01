import express from "express";
import upload from "../middleware/upload.js";
import { addMovie, getMovies, getMovieById , rateMovie, toggleFavorite , updateMovie, deleteMovie } from "../controllers/movieController.js";
 
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  isAdmin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdrop", maxCount: 1 },
  ]),
  addMovie
);

router.get("/", getMovies);
router.get("/:id", getMovieById);

router.post("/rate", protect, rateMovie);
router.post("/favorite", protect, toggleFavorite);

router.put(
  "/update/:id",
  protect,
  isAdmin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdrop", maxCount: 1 },
  ]),
  updateMovie
);
router.delete("/delete/:id", protect, isAdmin, deleteMovie);


export default router;