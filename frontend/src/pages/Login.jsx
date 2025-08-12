import React, { useState, useContext } from 'react';
import { loginUser } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });

  // Update form fields on input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manual login with email/password
  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form); // Call login service
      login(res.data); // Update context
      navigate('/'); // Redirect to homepage
    } catch (err) {
      alert('Invalid credentials');
      console.error(err);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Google OAuth login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
        token: credentialResponse.credential,
      });
      login(res.data);
      navigate('/');
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        {/* Page heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>

        {/* Email/password login form */}
        <form onSubmit={handleManualLogin} className="space-y-4 mb-2">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mb-4 text-gray-600">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </p>

        <div className="text-center mb-4 text-gray-500 text-sm">or</div>

        <div className="flex justify-center mb-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Google Login Failed')}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
