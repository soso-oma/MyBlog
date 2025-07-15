import Notification from '../models/notification.js';

/**
 * @desc Fetch all notifications for the logged-in user
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user._id })
      .populate('sender', 'username')           // Include sender's username
      .populate('post', 'slug title')           // Include related post info
      .sort({ createdAt: -1 });                 // Show newest first

    res.json(notifications);
  } catch (err) {
    console.error('Failed to get notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

/**
 * @desc Mark a specific notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    console.error('Failed to mark notification as read:', err);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

/**
 * @desc Count unread notifications for the user
 * @route GET /api/notifications/unread-count
 * @access Private
 */
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
};

/**
 * @desc Mark all notifications as read when visiting notification page
 * @route PATCH /api/notifications/mark-all/read
 * @access Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking all as read:', err);
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};
