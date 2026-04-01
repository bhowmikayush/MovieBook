 import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    type: String,
    required: true,
  },

  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
  },

  seats: [Number],

  paymentId: String,
});

export default mongoose.model("Booking", bookingSchema);