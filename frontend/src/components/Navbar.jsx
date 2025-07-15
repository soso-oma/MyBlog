import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificationCount(res.data.count || 0);
      } catch (err) {
        console.error('Failed to load notification count');
      }
    };

    if (user && token) fetchUnreadCount();
  }, [user, token, API_BASE_URL]);

  const hideExtras =
    ['/login', '/register', '/forgot-password'].some((path) =>
      location.pathname.startsWith(path)
    ) || location.pathname.startsWith('/reset-password');

  const handleNotificationClick = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/mark-all/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificationCount(0);
      navigate('/notifications');
    } catch (err) {
      console.error('Failed to mark notifications as read');
      navigate('/notifications');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
        >
          MyBlog
        </Link>

        {!hideExtras && (
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-l-md px-3 py-1 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded-r-md hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        )}

        <div className="flex items-center gap-5 text-sm">
          {user && !hideExtras && (
            <button
              onClick={handleNotificationClick}
              className="relative text-gray-600 hover:text-blue-600 text-lg"
              aria-label="Notifications"
            >
              🔔
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {notificationCount}
                </span>
              )}
            </button>
          )}

          {user ? (
            <>
              <Link
                to="/post/new"
                className="text-gray-600 font-medium hover:text-blue-600"
              >
                ➕ New Post
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 font-medium hover:text-blue-600"
              >
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="text-red-500 font-medium hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;