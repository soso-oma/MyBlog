import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.get('/unread-count', verifyToken, getUnreadNotificationCount);
router.patch('/mark-all/read', verifyToken, markAllAsRead);
router.patch('/:id/read', verifyToken, markNotificationAsRead);

export default router;
