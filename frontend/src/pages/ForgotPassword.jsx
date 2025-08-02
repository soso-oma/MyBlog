import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage(''); 
    try {
      // request to backend to trigger password reset email
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });

      setMessage(res.data.message || 'Password reset email sent.');
    } catch (err) {
      console.error(err);

      setMessage('Failed to send reset link.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {/* Reset Request Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email input
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Send Reset Link
        </button>
      </form>

      {/* Feedback Message */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
