import User from "../models/User.js";

//  GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log("GET USERS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//  DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("DELETE USER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER ROLE
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role))
      return res.status(400).json({ error: "Invalid role" });

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Role updated successfully", user });
  } catch (err) {
    console.log("UPDATE ROLE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};