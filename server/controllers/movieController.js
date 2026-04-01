 import Movie from "../models/Movie.js";

// ✅ ADD MOVIE
export const addMovie = async (req, res) => {
  try {
    if (!req.files?.poster || !req.files?.backdrop) {
      return res.status(400).json({ error: "Images required" });
    }

    const { title, description, price, totalSeats, releaseDate } = req.body;

    const poster = req.files.poster[0].filename;
    const backdrop = req.files.backdrop[0].filename;

    const movie = await Movie.create({
      title,
      description,
      poster,
      backdrop,
      price: Number(price) || 0,
      totalSeats: Number(totalSeats) || 0,
      releaseDate: releaseDate || "",
    });

    res.json(movie);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL MOVIES
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET SINGLE MOVIE
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const rateMovie = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    if (movie.ratedUsers.includes(userId)) {
      return res.status(400).json({
        error: "You already rated this movie",
      });
    }

    movie.totalRating += Number(rating);
    movie.ratingCount += 1;
    movie.ratedUsers.push(userId);

    await movie.save();

    res.json({ success: true, movie });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ❤️ TOGGLE FAVORITE
export const toggleFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const userId = String(req.user.id);

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    movie.favorites = movie.favorites.map((id) => String(id));

    if (movie.favorites.includes(userId)) {
      movie.favorites = movie.favorites.filter((id) => id !== userId);
    } else {
      movie.favorites.push(userId);
    }

    await movie.save();

    res.json({ favorites: movie.favorites });

  } catch (err) {
    console.log("FAVORITE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE MOVIE
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const { title, description, price, totalSeats, releaseDate } = req.body || {};

    if (title) movie.title = title;
    if (description) movie.description = description;
    if (price) movie.price = Number(price);
    if (totalSeats) movie.totalSeats = Number(totalSeats);
    if (releaseDate) movie.releaseDate = releaseDate;

    if (req.files?.poster) {
      movie.poster = req.files.poster[0].filename;
    }

    if (req.files?.backdrop) {
      movie.backdrop = req.files.backdrop[0].filename;
    }

    await movie.save();

    res.json({ success: true, movie });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE MOVIE
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ success: true, message: "Movie deleted successfully" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};