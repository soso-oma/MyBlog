import express from 'express';
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  toggleLikeComment, 
} from '../controllers/commentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:commentId', verifyToken, deleteComment);
router.patch('/:commentId/like', verifyToken, toggleLikeComment);

export default router;
