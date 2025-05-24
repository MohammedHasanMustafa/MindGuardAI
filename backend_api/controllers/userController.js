import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  getUserAnalytics,
  getCurrentUserProfile,
  getMyAnalyses,
  setResetToken,
  getUserByResetToken,
  updatePassword,
  clearResetToken
} from '../models/userModel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const SECRET = process.env.SECRET || 'mind-guard-special';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mind-guard-ai.vercel.app';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

// 🔐 Generate JWT
export const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '30d' });
};

// 📧 Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// ✅ Register
export const register = async (req, res) => {
  const { name, email, password, bio = '', profile_image = '' } = req.body;

  getUserByEmail(email, async (err, user) => {
    if (user) return res.status(409).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    createUser(name, email, hashedPassword, bio, profile_image, (err, userId) => {
      if (err) return res.status(500).json({ message: 'Registration failed' });

      const token = generateToken(userId);
      res.status(201).json({ token, user: { id: userId, name, email, bio, profile_image } });
    });
  });
};

// ✅ Login
export const login = (req, res) => {
  const { email, password } = req.body;

  getUserByEmail(email, async (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);
    
    // Get dashboard data to include in response
    getUserAnalytics(user.id, (err, analytics) => {
      if (err) {
        console.error('Failed to fetch analytics:', err);
        // Still return success but without analytics
        return res.json({
          message: 'Login successful - redirect to dashboard',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            profile_image: user.profile_image
          },
          redirect: '/dashboard'
        });
      }
      
      res.json({
        message: 'Login successful - redirect to dashboard',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          profile_image: user.profile_image
        },
        analytics, // Include dashboard data
        redirect: '/dashboard' // Flag for frontend to redirect
      });
    });
  });
};

// 🔐 Dashboard (Analytics)
export const getDashboard = (req, res) => {
  const userId = req.user.id;

  getUserAnalytics(userId, (err, analytics) => {
    if (err) return res.status(500).json({ message: 'Failed to load analytics' });
    res.json({ analytics });
  });
};

// 👤 Get Profile
export const getProfile = (req, res) => {
  const userId = req.user.id;
  console.log('Fetching profile for user ID:', userId); // Debug log

  getCurrentUserProfile(userId, (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      console.error('No user found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  });
};

// ✏️ Update Profile
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email, bio, profile_image } = req.body;

  updateUserById(userId, { name, email, bio, profile_image }, (err, changes) => {
    if (err || changes === 0) return res.status(500).json({ message: 'Profile update failed' });
    res.json({ message: 'Profile updated successfully' });
  });
};

// 📊 Get My Analyses
export const getMyAnalyse = (req, res) => {
  const userId = req.user.id;

  getMyAnalyses(userId, (err, analyses) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch analyses' });
    res.json({ analyses });
  });
};

// 🔐 Forgot Password
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  getUserByEmail(email, (err, user) => {
    if (err || !user) return res.status(404).json({ message: 'Email not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    setResetToken(user.id, resetToken, expiry, (err) => {
      if (err) return res.status(500).json({ message: 'Failed to set reset token' });

      const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

      const mailOptions = {
        from: EMAIL_FROM,
        to: email,
        subject: 'Password Reset',
        html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ message: 'Email failed to send' });
        res.json({ message: 'Reset link sent to email' });
      });
    });
  });
};

// 🔁 Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  getUserByResetToken(token, async (err, user) => {
    if (err || !user || user.reset_token_expiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updatePassword(user.id, hashedPassword, (err) => {
      if (err) return res.status(500).json({ message: 'Failed to reset password' });

      clearResetToken(user.id, () => {
        res.json({ message: 'Password updated successfully' });
      });
    });
  });
};
