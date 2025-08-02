import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token from header (removing "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user to request object for use in next middleware/controller
    req.user = user;
    next();
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
