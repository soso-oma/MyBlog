import axios from 'axios';

// Base API URL from environment variable
const API = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch all notifications for the authenticated user
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object[]>} - List of notifications
 */
export const getNotifications = async (token) => {
  const res = await axios.get(`${API}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Mark a specific notification as read
 * @param {string} id - Notification ID
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - For notification object
 */
export const markNotificationAsRead = async (id, token) => {
  const res = await axios.patch(`${API}/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
