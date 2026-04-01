 import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const googleAuth = async (req, res) => {
  try {
      console.log("BODY DATA:", req.body);
    const { uid, name, email, photo } = req.body;

    let user = await User.findById(uid);

  if (!user) {
  user = await User.create({
    _id: uid,
    name,
    email,
    photo,
    role: email === "your@gmail.com" ? "admin" : "user", 
  });
}

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};