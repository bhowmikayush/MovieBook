import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import { verifySMTP } from "./utils/sendMail.js";

// routes
import movieRoutes from "./routes/movieRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

//  Connect DB first
connectDB();

const app = express();

//  Middlewares
 const allowedOrigins = [
  process.env.CLIENT_URL
];



app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

//  Static files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);

//  Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  //  Verify email server AFTER server starts
  await verifySMTP();
});

 