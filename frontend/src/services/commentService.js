import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const API_URL = `${API_BASE_URL}/api/comments`; 

export const createComment = (data, token) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getComments = (postId) => 
  axios.get(`${API_URL}/${postId}`);

export const deleteComment = (commentId, token) =>
  axios.delete(`${API_URL}/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const toggleCommentLike = (commentId, token) =>
  axios.patch(`${API_URL}/${commentId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
