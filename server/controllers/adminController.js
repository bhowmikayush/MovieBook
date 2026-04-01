import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

export const getStats = async (req, res) => {
  const users = await User.countDocuments();
  const movies = await Movie.countDocuments();
  const shows = await Show.countDocuments();

  res.json({ users, movies, shows });
};