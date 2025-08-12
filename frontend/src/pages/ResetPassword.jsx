import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Form submission to reset the password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // POST request to reset password with token and new password
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`, { password });

      setMessage(res.data.message || 'Password reset successfully');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to reset password.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      {/* Password reset form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Reset Password
        </button>
      </form>

      {/* Display message to user */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default ResetPassword;
