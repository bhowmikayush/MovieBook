 import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  poster: String,
  backdrop: String,

  price: Number,
  totalSeats: Number,

  releaseDate: String, // ✅ NEW

   // ⭐ RATING SYSTEM
  totalRating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },

  // ❤️ FAVORITES
  favorites: [
    {
      type: String, // user id
    },
  ],

  ratedUsers: [
    {
      type: String,
    },
  ],

  
});

export default mongoose.model("Movie", movieSchema);