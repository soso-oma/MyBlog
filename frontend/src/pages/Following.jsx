import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Following = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [following, setFollowing] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${id}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowing(res.data);
      } catch (err) {
        console.error('Error fetching following:', err);
      }
    };
    fetchFollowing();
  }, [id, token]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Following</h2>
      {following.length === 0 ? (
        <p>Not following anyone yet.</p>
      ) : (
        <ul className="space-y-4">
          {following.map((user) => (
            <li key={user._id} className="flex items-center gap-4">
              <img
                src={user.profilePicture || '/default-avatar.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link to={`/profile/${user.username}`} className="text-blue-600 font-semibold hover:underline">
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Following;
