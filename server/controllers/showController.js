 

import Show from "../models/Show.js";
import Movie from "../models/Movie.js";

// ADD SHOW (ADMIN)
export const addShow = async (req, res) => {
  try {
    const { movieId, date, time } = req.body;

    // Validation
    if (!movieId || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find movie
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    const totalSeats = Number(movie.totalSeats);
    if (!totalSeats || totalSeats <= 0) {
      return res.status(400).json({ error: "Invalid totalSeats in movie" });
    }

    // Create seats array (false = available)
    const seats = new Array(totalSeats).fill(false);

    // Create show
    const show = await Show.create({
      movie: movieId,
      date,
      time,
      seats,
    });

    res.status(201).json(show);
  } catch (err) {
    console.log("ADD SHOW ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//  GET ALL SHOWS WITH MOVIE DETAILS
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie", "title price totalSeats") // include price for frontend
      .sort({ date: 1, time: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET SINGLE SHOW (FOR SEAT LAYOUT)
export const getSingleShow = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findById(id).populate("movie", "title price totalSeats");

    if (!show) return res.status(404).json({ error: "Show not found" });

    res.json(show);
  } catch (err) {
    console.log("GET SINGLE SHOW ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

 

//  DELETE SHOW (ADMIN)
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findByIdAndDelete(id);
    if (!show) return res.status(404).json({ error: "Show not found" });
    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  UPDATE SHOW (ADMIN)
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, seats } = req.body;

    // Ensure seats is a boolean array
    let updatedSeats = seats;
    if (seats && !Array.isArray(seats)) {
      updatedSeats = JSON.parse(seats); // in case frontend sends stringified array
    }

    const updatedShow = await Show.findByIdAndUpdate(
      id,
      { date, time, seats: updatedSeats },
      { new: true }
    ).populate("movie", "title price totalSeats");

    if (!updatedShow) return res.status(404).json({ error: "Show not found" });

    res.json(updatedShow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET SHOWS BY MOVIE
export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({ movie: movieId })
      .populate("movie", "title price totalSeats")
      .sort({ date: 1, time: 1 });

    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};