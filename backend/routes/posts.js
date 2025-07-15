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

// Create post
router.post('/', verifyToken, upload.single('image'), createPost);

// Get all posts
router.get('/', getPosts);

// Search posts
router.get('/search', getSearchResults);

// Update post
router.patch('/:id', verifyToken, upload.single('image'), updatePost);

// Delete post
router.delete('/:id', verifyToken, deletePost);

// Like/unlike post
router.put('/:id/like', verifyToken, toggleLike);

// Get posts by username
router.get('/user/username/:username', verifyToken, getPostsByUsername);

// Get posts by user ID
router.get('/user/:userId', verifyToken, getPostsByUser);

// Get post by slug
router.get('/slug/:slug', getPostBySlug);

// Get post by ID (should still be last)
router.get('/:id', getPostById);

export default router;
