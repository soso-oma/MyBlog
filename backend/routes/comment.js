import express from 'express';
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  toggleLikeComment, // Controller to toggle like/unlike on a comment
} from '../controllers/commentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Route to create a comment (authentication required)
router.post('/', verifyToken, createComment);

// Route to get all comments for a specific post (public)
router.get('/:postId', getCommentsByPost);

// Route to delete a specific comment (authentication required)
router.delete('/:commentId', verifyToken, deleteComment);

// Route to like/unlike a comment (authentication required)
router.patch('/:commentId/like', verifyToken, toggleLikeComment);

export default router;
