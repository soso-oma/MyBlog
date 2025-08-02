import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import upload from '../utils/multer.js';

import {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  toggleLike,
  getPostsByUser,
  getPostsByUsername,
  getSearchResults
} from '../controllers/postController.js';

const router = express.Router();

router.post('/', verifyToken, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/search', getSearchResults);
router.patch('/:id', verifyToken, upload.single('image'), updatePost);
router.delete('/:id', verifyToken, deletePost);
router.put('/:id/like', verifyToken, toggleLike);
router.get('/user/username/:username', verifyToken, getPostsByUsername);
router.get('/user/:userId', verifyToken, getPostsByUser);
router.get('/slug/:slug', getPostBySlug);
router.get('/:id', getPostById);

export default router;
