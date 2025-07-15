// routes/user.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import upload from '../utils/multer.js';
import {
  getUserProfile,
  getUserByUsername,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  searchUsers,
  getFollowers,
  getFollowing,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/username/:username', verifyToken, getUserByUsername);
router.get('/search', verifyToken, searchUsers); 
router.get('/:id', verifyToken, getUserProfile);
router.put('/:id', verifyToken, upload.single('profilePicture'), updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.put('/:id/follow', verifyToken, followUser);
router.put('/:id/unfollow', verifyToken, unfollowUser);
router.get('/:id/followers', verifyToken, getFollowers);
router.get('/:id/following', verifyToken, getFollowing);

export default router;
