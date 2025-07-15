import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  const renderMessage = (notif) => {
    const sender = notif?.sender?.username || 'Someone';
    const postTitle = notif?.post?.title || 'your post';
    const postSlug = notif?.post?.slug || '#';

    if (notif.type === 'like') {
      return (
        <Link to={`/post/${postSlug}`} className="text-blue-600 hover:underline">
          {sender} liked your post "<strong>{postTitle}</strong>"
        </Link>
      );
    }

    if (notif.type === 'comment') {
      return (
        <Link to={`/post/${postSlug}`} className="text-blue-600 hover:underline">
          {sender} commented on your post "<strong>{postTitle}</strong>"
        </Link>
      );
    }

    if (notif.type === 'follow') {
      return (
        <Link to={`/profile/${sender}`} className="text-green-600 hover:underline">
          {sender} started following you
        </Link>
      );
    }

    return <span>New activity</span>;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔔 Notifications</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-600">You have no new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 rounded border ${
                notif.isRead ? 'bg-gray-100' : 'bg-white shadow'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{renderMessage(notif)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
