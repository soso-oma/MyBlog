import React, { useEffect, useState, useContext } from 'react';
import { getPosts, toggleLike } from '../services/postService';
import { createComment } from '../services/commentService';
import { followUser, unfollowUser } from '../services/userService';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  // Fetch posts and set them here
  const [posts, setPosts] = useState([]);
  // Track which posts show full content
  const [expandedPostIds, setExpandedPostIds] = useState([]);
  // Store comment text per post
  const [commentInputs, setCommentInputs] = useState({});
  // Which posts show comment form
  const [visibleCommentForms, setVisibleCommentForms] = useState([]);
  // List of IDs I follow
  const [followingIds, setFollowingIds] = useState([]);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Load posts and my following IDs
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        setPosts(res.data);
        if (user?.following) setFollowingIds(user.following.map((u) => u._id));
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    fetchPosts();
  }, [user?.following]);

  // Update comment input for a post
  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  // Submit comment for a post
  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      await createComment({ postId, content: text }, token);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      alert('Comment posted! View full comments on post page.');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment');
    }
  };

  // Like or unlike a post
  const handleLike = async (postId) => {
    try {
      const res = await toggleLike(postId, token);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
      alert('Failed to like post');
    }
  };

  // Show or hide comment form
  const toggleCommentForm = (postId) => {
    setVisibleCommentForms((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // Follow or unfollow author
  const handleFollowToggle = async (authorId) => {
    try {
      if (followingIds.includes(authorId)) {
        await unfollowUser(authorId, token);
        setFollowingIds((prev) => prev.filter((id) => id !== authorId));
      } else {
        await followUser(authorId, token);
        setFollowingIds((prev) => [...prev, authorId]);
      }
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  return (
    <div className="p-4 max-w-full md:max-w-4xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📚 Recent Posts</h1>

      {posts.map((post) => {
        const isExpanded = expandedPostIds.includes(post._id);
        const wordLimit = isExpanded ? 600 : 70;
        const words = post.content.trim().split(/\s+/);
        const showToggle = words.length > 100;
        const hasLiked = user && post.likes?.includes(user._id);
        const showCommentForm = visibleCommentForms.includes(post._id);
        const authorId = post.author?._id;
        const isMyPost = user?._id === authorId;
        const isFollowing = followingIds.includes(authorId);

        return (
          <div
            key={post._id}
            className="mb-6 p-4 border rounded-lg bg-white shadow-sm w-full"
          >
            {/* Post title links to details */}
            <Link to={`/post/${post.slug}`}>
              <h2 className="text-xl font-semibold text-blue-700 hover:underline">
                {post.title}
              </h2>
            </Link>

            {/* Author info and follow button */}
            <p className="text-sm text-gray-600 mt-1">
              {post.category}
              <br />
              By{' '}
              <Link
                to={`/profile/${post.author?.username}`}
                className="text-blue-600 hover:underline"
              >
                @{post.author?.username || 'Unknown'}
              </Link>
              {!isMyPost && user && authorId && (
                <button
                  onClick={() => handleFollowToggle(authorId)}
                  className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    isFollowing
                      ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
              <br />
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

            {/* Post content with "read more" */}
            <p className="text-gray-800 leading-relaxed text-base mt-2">
              {words.slice(0, wordLimit).join(' ')}
              {words.length > wordLimit && '...'}
            </p>

            {showToggle && (
              <button
                onClick={() =>
                  setExpandedPostIds((prev) =>
                    prev.includes(post._id)
                      ? prev.filter((id) => id !== post._id)
                      : [...prev, post._id]
                  )
                }
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}

            {/* Post image */}
            {post.image && (
              <div className="my-4 w-full overflow-hidden rounded-md bg-gray-100">
                <img
                  src={
                    post.image.startsWith('http')
                      ? post.image
                      : `${import.meta.env.VITE_API_BASE_URL}${post.image}`
                  }
                  alt={post.title}
                  className="w-full max-h-[55vh] object-contain rounded-md"
                />
              </div>
            )}

            {/* Like and comment buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {user ? (
                <>
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`text-sm font-medium ${
                      hasLiked
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-blue-600 hover:underline'
                    }`}
                  >
                    👍 {post.likes?.length || 0} {hasLiked ? 'Unlike' : 'Like'}
                  </button>

                  <button
                    onClick={() => toggleCommentForm(post._id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    💬 Comment
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>{' '}
                  to like or comment.
                </p>
              )}
            </div>

            {/* Comment input form */}
            {user && showCommentForm && (
              <form
                onSubmit={(e) => handleCommentSubmit(e, post._id)}
                className="mt-3"
              >
                <textarea
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a comment..."
                  rows="2"
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
                >
                  Post Comment
                </button>
              </form>
            )}

            {/* Link to full comments on post page */}
            <Link
              to={`/post/${post.slug}#comments`}
              className="text-blue-500 text-sm mt-2 inline-block hover:underline"
            >
              View all comments
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
