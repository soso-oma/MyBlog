import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchPosts } from '../services/postService';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const SearchResults = () => {
  // Access the authentication token from context
  const { token } = useContext(AuthContext);

  // State to hold post and user search results
  const [postResults, setPostResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true); // Loading indicator

  // Extract the search query string from the URL (e.g. /search?q=react)
  const query = new URLSearchParams(useLocation().search).get('q');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        // Make parallel requests to search for posts and users
        const [postData, userRes] = await Promise.all([
          searchPosts(query),
          axios.get(`${API_BASE_URL}/api/users/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPostResults(postData);
        setUserResults(userRes.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false); 
      }
    };

    fetchResults();
  }, [query, token]);

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6 space-y-6">
      <h2 className="text-xl font-semibold">
        Search Results for "<span className="text-blue-600">{query}</span>"
      </h2>

      {/* Loading state */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Section: Matching Users */}
          <div>
            <h3 className="text-lg font-bold mb-2">Users</h3>
            {userResults.length > 0 ? (
              userResults.map((user) => (
                <Link
                  to={`/profile/${user.username}`}
                  key={user._id}
                  className="block p-3 border border-gray-200 rounded hover:bg-gray-50 mb-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      {user.name && <p className="text-sm text-gray-500">{user.name}</p>}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No users found.</p>
            )}
          </div>

          {/* Section: Matching Posts */}
          <div>
            <h3 className="text-lg font-bold mb-2 mt-4">Posts</h3>
            {postResults.length > 0 ? (
              postResults.map((post) => (
                <Link
                  to={`/post/${post.slug}`}
                  key={post._id}
                  className="block border-b border-gray-200 py-4 hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-bold text-blue-600">{post.title}</h3>
                  <p className="text-sm text-gray-500">By {post.author?.username}</p>
                  <p className="text-gray-700 mt-1">
                    {post.content.length > 100
                      ? `${post.content.slice(0, 100)}...`
                      : post.content}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-600">No posts found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
