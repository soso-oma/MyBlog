import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import sendEmail from '../utils/sendEmail.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Format user to send to frontend
const formatUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar || '',
});

// Register
export const register = async (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const newUser = new User({ username, email, password }); 
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({ user: formatUser(newUser), token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Manual login with detailed error
export const login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = generateToken(user._id);
    res.json({ user: formatUser(user), token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found with this email' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const message = `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}" target="_blank">${resetURL}</a>
      <p>This link expires in 1 hour.</p>
    `;

    await sendEmail(user.email, 'Password Reset Request', message);
    res.json({ message: 'Password reset email sent successfully' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();
    const trimmedEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      user = new User({
        username: name,
        email: trimmedEmail,
        password: randomPassword,
        avatar: picture,
      });
      await user.save();
    }

    const jwtToken = generateToken(user._id);
    res.json({ user: formatUser(user), token: jwtToken });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Google login failed' });
  }
};
