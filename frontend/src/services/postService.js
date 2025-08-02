import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/api/posts`;

/**
 * Fetch all posts
 * @returns {Promise<AxiosResponse>}
 */
export const getPosts = async () => axios.get(API_URL);

/**
 * Get a post by its slug (used for post detail or editing)
 * @param {string} slug
 * @returns {Promise<AxiosResponse>}
 */
export const getPostBySlug = async (slug) =>
  axios.get(`${API_URL}/slug/${slug}`);

/**
 * Get a post by its ID (used internally for updates)
 * @param {string} id
 * @returns {Promise<AxiosResponse>}
 */
export const getPostById = async (id) =>
  axios.get(`${API_URL}/${id}`);

/**
 * Create a new post (requires authentication)
 * @param {FormData} data - Post data including optional image
 * @param {string} token - JWT token
 * @returns {Promise<AxiosResponse>}
 */
export const createPost = async (data, token) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * Update an existing post using PATCH
 * @param {string} id - Post ID
 * @param {Object} data - Updated post data
 * @param {string} token - JWT token
 * @returns {Promise<AxiosResponse>}
 */
export const updatePost = async (id, data, token) =>
  axios.patch(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * Delete a post by its ID
 * @param {string} id - Post ID
 * @param {string} token - JWT token
 * @returns {Promise<AxiosResponse>}
 */
export const deletePost = async (id, token) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * Toggle like/unlike on a post
 * @param {string} postId - Post ID
 * @param {string} token - JWT token
 * @returns {Promise<AxiosResponse>}
 */
export const toggleLike = async (postId, token) =>
  axios.post(`${API_URL}/${postId}/like`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * Get posts created by a specific user
 * @param {string} userId - User ID
 * @param {string} token - JWT token
 * @returns {Promise<AxiosResponse>}
 */
export const getPostsByUser = (userId, token) => {
  return axios.get(`${API_BASE_URL}/api/posts/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Search posts by title or content
 * @param {string} query - Search query
 * @returns {Promise<Object[]>} - Matching posts
 */
export const searchPosts = async (query) => {
  const res = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return res.data;
};
