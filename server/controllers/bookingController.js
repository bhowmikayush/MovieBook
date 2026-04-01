 import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { sendBookingEmail } from "../utils/sendMail.js";
import User from "../models/User.js";

export const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // Auth check
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!showId || !seats || seats.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    //  Find show
    const show = await Show.findById(showId).populate("movie");

    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    //  Check seat availability
    for (let i of seats) {
      if (show.seats[i]) {
        return res.status(400).json({
          error: `Seat ${i + 1} already booked`,
        });
      }
    }

    //  Book seats
    seats.forEach((i) => {
      show.seats[i] = true;
    });

    await show.save();

    //  Create booking
    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      seats,
      paymentId: "COD",
    });

    //  Get user
    const user = await User.findById(req.user.id);

    // ✅ Send email (NON-BLOCKING)
    sendBookingEmail(user?.email, {
      movie: show.movie?.title || "Movie",
      date: show.date,
      time: show.time,
      seats: seats.map((s) => s + 1),
      payment: "COD",
      bookingId: booking._id,
    }).catch(() => {});

    // ✅ Response first (fast API)
    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET MY BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "show",
        populate: {
          path: "movie",
        },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};