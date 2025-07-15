import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

// FOLLOW user
export const followUser = (id, token) =>
  axios.put(`${API}/api/users/${id}/follow`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// UNFOLLOW user
export const unfollowUser = (id, token) =>
  axios.put(`${API}/api/users/${id}/unfollow`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
