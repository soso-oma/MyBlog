import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { followUser, unfollowUser } from '../services/userService';

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const isMyProfile = !username || username === user?.username;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const userUrl = isMyProfile
          ? `${API_BASE_URL}/api/users/${user._id}`
          : `${API_BASE_URL}/api/users/username/${username}`;

        const postsUrl = isMyProfile
          ? `${API_BASE_URL}/api/posts/user/${user._id}`
          : `${API_BASE_URL}/api/posts/user/username/${username}`;

        const [profileRes, postsRes] = await Promise.all([
          axios.get(userUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(postsUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfileData(profileRes.data);
        setBio(profileRes.data.bio || '');
        setPosts(postsRes.data);
        setIsFollowing(profileRes.data.followers?.some(f => f._id === user._id));
      } catch (err) {
        console.error('Error fetching profile or posts:', err);
      }
    };

    if (token && (user || username)) {
      fetchProfileAndPosts();
    }
  }, [username, token, API_BASE_URL, user]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileData._id, token);
      } else {
        await followUser(profileData._id, token);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow/unfollow failed:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const res = await axios.put(
        `${API_BASE_URL}/api/users/${user._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(res.data);
      setMessage('✅ Profile updated successfully');
      setProfilePicture(null);
    } catch (err) {
      console.error('Update error:', err);
      setMessage('❌ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Account deleted.');
      logout();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete account');
    }
  };

  if (!profileData)
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-black-600">
        {isMyProfile ? 'My Profile' : `@${profileData.username}'s Profile`}
      </h2>

      {isMyProfile ? (
        <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : profileData.profilePicture || '/default-avatar.png'
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border shadow mb-2 bg-white"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Bio</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          {message && <p className="text-center text-sm text-gray-700 mt-2">{message}</p>}

          <hr className="my-6 border-gray-300" />

          <div className="flex flex-col gap-3 text-center">
            <button onClick={logout} className="text-gray-600 hover:text-black underline">
              Log Out
            </button>
            <button onClick={handleDelete} className="text-red-600 hover:underline">
              Delete Account
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <img
            src={profileData.profilePicture || '/default-avatar.png'}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto object-cover border shadow bg-white mb-4"
          />
          <p className="mb-2 text-gray-700">{profileData.bio}</p>
          <button
            onClick={handleFollowToggle}
            className={`mt-2 px-4 py-1 rounded-md text-white ${
              isFollowing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      )}

      {/* 🔗 Followers & Following Link Section */}
      <div className="mt-6 text-center text-sm text-gray-600 space-x-4">
        <Link to={`/profile/${profileData._id}/followers`} className="hover:underline">
          <strong>{profileData.followers.length}</strong> Followers
        </Link>
        <Link to={`/profile/${profileData._id}/following`} className="hover:underline">
          <strong>{profileData.following.length}</strong> Following
        </Link>
      </div>

      {/* 📚 Posts Section */}
      {posts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            {isMyProfile ? 'My Posts' : `${profileData.username}'s Posts`}
          </h3>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post._id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
                <Link
                  to={`/post/${post.slug}`}
                  className="text-lg font-medium text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
