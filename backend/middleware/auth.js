// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token and attach user to request
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token from header (removing "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token payload and exclude password field
    const user = await User.findById(decoded.userId).select('-password');

    // If user no longer exists
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user to request object for use in next middleware/controller
    req.user = user;
    next();
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
