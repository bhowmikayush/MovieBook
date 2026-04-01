 import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  photo: String, // ✅ ADD THIS
  role: { type: String, default: "user" },
});

export default mongoose.model("User", userSchema);