import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPostBySlug, deletePost } from '../services/postService';
import {
  createComment,
  getComments,
  deleteComment,
  toggleCommentLike,
} from '../services/commentService';

const PostDetails = () => {
  // I get the slug from the URL so I know which post to fetch
  const { slug } = useParams();
  const navigate = useNavigate();

  const { user, token } = useContext(AuthContext);

  // Using state to hold the post, comments, and various UI states like loading, reply inputs, etc.
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [replyFormVisible, setReplyFormVisible] = useState({});
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetching the post and its comments when the component loads or the slug changes.
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const res = await getPostBySlug(slug);
        setPost(res.data);

        const commentsRes = await getComments(res.data._id);
        setComments(commentsRes.data);
      } catch (err) {
        console.error('Failed to fetch post or comments', err);
      } finally {

        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug]);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(post._id, token);
      alert('Post deleted');
    
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Unauthorized or failed');
    }
  };

  // Submitting a new top-level comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const text = newComment.trim();

    if (!text || !post?._id) return;

    try {
      const res = await createComment({ postId: post._id, content: text }, token);
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Comment failed:', err);
      alert('Failed to comment');
    }
  };

  // I handle replies similarly, but I keep track of which comment I'm replying to
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    const text = replyInputs[parentId]?.trim();

    if (!text || !post?._id) return;

    try {
      // Creating a comment with a parent property to nest it as a reply
      const res = await createComment({ postId: post._id, content: text, parent: parentId }, token);
      // Adding the reply to comments state
      setComments((prev) => [...prev, res.data]);
      // Clearing the reply input for that comment
      setReplyInputs((prev) => ({ ...prev, [parentId]: '' }));
      // Hiding the reply form after submitting
      setReplyFormVisible((prev) => ({ ...prev, [parentId]: false }));
    } catch (err) {
      console.error('Reply failed:', err);
      alert('Failed to reply');
    }
  };

  // I let users delete their own comments, asking for confirmation first
  const handleCommentDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(id, token);
      // Remove the deleted comment from my comments state
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Delete comment failed:', err);
      alert('Unauthorized or failed');
    }
  };

  // When a user likes or unlikes a comment, I send the request and update state accordingly
  const handleCommentLike = async (id) => {
    try {
      const res = await toggleCommentLike(id, token);
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, likes: res.data.likes } : c))
      );
    } catch (err) {
      console.error('Like failed:', err);
      alert('Failed to like');
    }
  };

  const toggleReplyForm = (id) => {
    setReplyFormVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Because comments come in flat, I organize them into top-level comments and their nested replies
  const organizeComments = () => {
    // First, I grab all comments with no parent as top-level
    const topLevel = comments.filter((c) => !c.parent);
    // Then I grab all replies that have a parent ID
    const replies = comments.filter((c) => c.parent);
    // Map from parent comment ID to its replies
    const replyMap = {};
    replies.forEach((r) => {
      replyMap[r.parent] = replyMap[r.parent] || [];
      replyMap[r.parent].push(r);
    });
    // Top-level comments with their replies attached
    return topLevel.map((comment) => ({
      ...comment,
      replies: replyMap[comment._id] || [],
    }));
  };

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (!post) return <p className="text-center p-4">Post not found</p>;

  const isOwner = user && user._id === post.author._id;

  return (
    <div className="p-4 max-w-full md:max-w-4xl mx-auto relative">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-semibold mb-2 break-words">{post.title}</h1>
          <p className="text-gray-600 text-sm mb-4 whitespace-nowrap">
            By{' '}
            <Link
              to={`/profile/${post.author?.username}`}
              className="text-blue-600 hover:underline"
            >
              @{post.author?.username || 'Unknown'}
            </Link>
          </p>
        </div>

        {/* Show edit/delete options only if user own the post */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowPostOptions((prev) => !prev)}
              className="text-xl hover:scale-110"
              aria-label="Post options"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>
            </button>
            {showPostOptions && (
              <div className="absolute right-0 mt-2 w-28 bg-white border shadow rounded z-10">
                {/* Edit link */}
                <Link
                  to={`/post/edit/${post.slug}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                >
                  ✏️ Edit
                </Link>
                {/* Delete button */}
                <button
                  onClick={handleDeletePost}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Show post image */}
      {post.image && (
        <div className="my-4 w-full overflow-hidden rounded bg-gray-100">
          <img
            src={
              post.image.startsWith('http')
                ? post.image
                : `${import.meta.env.VITE_API_BASE_URL}${post.image}`
            }
            alt={post.title}
            className="w-full max-h-[70vh] object-contain rounded"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}

      <p className="mb-8 leading-relaxed text-gray-800 whitespace-pre-line break-words">{post.content}</p>

      <div className="mt-8" id="comments">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {organizeComments().length === 0 && <p className="text-gray-500">No comments yet.</p>}

        {organizeComments().map((comment) => {
          const hasLiked = user && comment.likes?.includes(user._id);
          return (
            <div key={comment._id} className="mb-4 border-b pb-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <Link
                  to={`/profile/${comment.author?.username}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  @{comment.author?.username || 'Unknown'}
                </Link>

                {user && user._id === comment.author?._id && (
                  <button
                    onClick={() => handleCommentDelete(comment._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="ml-1 text-gray-800 break-words">{comment.content}</p>

              {/* Like and reply buttons only if logged in */}
              {user && (
                <div className="flex gap-4 ml-1 mt-1 flex-wrap">
                  <button
                    onClick={() => handleCommentLike(comment._id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    👍 {comment.likes?.length || 0} {hasLiked ? 'Unlike' : 'Like'}
                  </button>
                  <button
                    onClick={() => toggleReplyForm(comment._id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    💬 Reply
                  </button>
                </div>
              )}

              {replyFormVisible[comment._id] && user && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, comment._id)}
                  className="mt-2 ml-4 space-y-1"
                >
                  <textarea
                    value={replyInputs[comment._id] || ''}
                    onChange={(e) =>
                      setReplyInputs((prev) => ({ ...prev, [comment._id]: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                    rows="2"
                    placeholder="Write a reply..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Submit Reply
                  </button>
                </form>
              )}

              {/* Render each reply to this comment */}
              {comment.replies.map((reply) => {
                const hasLikedReply = user && reply.likes?.includes(user._id);
                return (
                  <div key={reply._id} className="ml-6 mt-2 border-l pl-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <Link
                        to={`/profile/${reply.author?.username}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        @{reply.author?.username || 'Unknown'}
                      </Link>

                      {user && user._id === reply.author?._id && (
                        <button
                          onClick={() => handleCommentDelete(reply._id)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                   
                    <p className="ml-1 text-gray-800 break-words">{reply.content}</p>
            
                    {user && (
                      <button
                        onClick={() => handleCommentLike(reply._id)}
                        className="text-sm text-blue-600 hover:underline ml-1"
                      >
                        👍 {reply.likes?.length || 0} {hasLikedReply ? 'Unlike' : 'Like'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Comment submission form for logged in users */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mt-6 space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded"
              rows="3"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-600 mt-4">Login to leave a comment.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
