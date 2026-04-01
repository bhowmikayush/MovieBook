 import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import { sendBookingEmail } from "../utils/sendMail.js";
import User from "../models/User.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay();

    const { showId, seats } = req.body;

    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    const movieId = show.movie || show.movieId;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const totalAmount = movie.price * seats.length;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
    });

    res.json(order);

  } catch (err) {
    console.log("CREATE ORDER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// SAFE RAZORPAY INSTANCE
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys missing in .env");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// VERIFY PAYMENT + SAVE BOOKING + SEND EMAIL
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      showId,
      seats,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    for (let i of seats) {
      if (show.seats[i]) {
        return res.status(400).json({
          error: `Seat ${i + 1} already booked`,
        });
      }
    }

    seats.forEach((i) => {
      show.seats[i] = true;
    });

    await show.save();

    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      seats,
      paymentId: razorpay_payment_id,
    });

    const user = await User.findById(req.user.id);

    const showWithMovie = await Show.findById(showId).populate("movie");

    try {
      await sendBookingEmail(user?.email, {
        movie: showWithMovie.movie?.title || "Movie",
        date: showWithMovie.date,
        time: showWithMovie.time,
        seats: seats.map((s) => s + 1),
        payment: "ONLINE",
        bookingId: booking._id,
      });
    } catch (mailErr) {
      console.log("EMAIL ERROR:", mailErr);
    }

    res.json({
      success: true,
      message: "Payment successful & booking confirmed",
      booking,
    });

  } catch (err) {
    console.log("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};