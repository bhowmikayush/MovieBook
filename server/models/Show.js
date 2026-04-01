 import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },

  date: String,
  time: String,

  seats: [Boolean], // true = booked
});

export default mongoose.model("Show", showSchema);