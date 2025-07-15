import axios from 'axios';

// Create an Axios instance with a predefined base URL
// This base URL is dynamically set using an environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
});

// Export the configured Axios instance for reuse throughout the app
export default api;
