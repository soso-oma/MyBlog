import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state to hold user input
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Error state for displaying registration errors
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handle input changes for form fields
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send registration request to backend
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      
      // Automatically log the user in upon successful registration
      login(res.data);
      navigate('/');
    } catch (err) {
      // Set error message for user feedback
      setError(err.response?.data?.message || 'Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>

      {/* Registration form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      {/* Error message display */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Register;
