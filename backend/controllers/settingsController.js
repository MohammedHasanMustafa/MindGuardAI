import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadImage } from "../utils/uploadImage.js"; 

// Get user profile data
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { name, email, bio, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle image upload (if there is a profile image uploaded)
    if (req.files && req.files.profileImage) {
      const uploadedImagePath = await uploadImage(req.files.profileImage);
      user.profileImage = uploadedImagePath; // Store image path in DB
    }

    // Update user data if provided in request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save(); // Save updated user info to DB
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Logout function (clear token in cookies)
export const logout = (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.status(200).json({ message: "Logged out successfully" });
};
