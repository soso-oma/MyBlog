import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token and attach user to the request
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token part (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Decode and verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use either 'userId' or 'id' depending on how token was generated
    const userId = decoded.userId || decoded.id;

    // Fetch the user from the database, excluding the password
    const user = await User.findById(userId).select('-password');

    // If no user is found, reject the request
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Attach the user to the request for access in next middleware/routes
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
