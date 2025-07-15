import axios from 'axios';

// Base API URL from environment variable, with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Construct the full comment API endpoint
const API_URL = `${API_BASE_URL}/api/comments`; 

// Create a new comment
export const createComment = (data, token) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get comments for a specific post
export const getComments = (postId) => 
  axios.get(`${API_URL}/${postId}`);

// Delete a specific comment by ID (requires auth token)
export const deleteComment = (commentId, token) =>
  axios.delete(`${API_URL}/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Toggle like/unlike for a comment (requires auth token)
export const toggleCommentLike = (commentId, token) =>
  axios.patch(`${API_URL}/${commentId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
