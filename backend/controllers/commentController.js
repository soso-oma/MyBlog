import Comment from '../models/comment.js';
import Post from '../models/Post.js';
import Notification from '../models/notification.js';

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { postId, content, parent } = req.body;

    // Check if user is authenticated
    if (!req.user) return res.status(401).json({ message: 'Unauthorized: Missing user' });

    // Ensure required fields are provided
    if (!postId || !content) return res.status(400).json({ message: 'Post ID and content are required' });

    // Create new comment document
    const comment = new Comment({
      post: postId,
      content,
      author: req.user._id,
      parent: parent || null, // Optional: support for threaded comments
    });

    await comment.save();

    // Send notification to post author (if not self-comment)
    const post = await Post.findById(postId);
    if (post && post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        type: 'comment',
        sender: req.user._id,
        receiver: post.author,
        post: post._id,
      });
    }

    // Populate author's username before sending response
    const populated = await comment.populate('author', 'username');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all comments for a specific post
export const getCommentsByPost = async (req, res) => {
  try {
    // Fetch comments for a post and sort them by creation time (oldest first)
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get comments', error: err.message });
  }
};

// Delete a comment by author
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Ensures only the author can delete their own comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};

// Toggle like/unlike on a comment
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const userId = req.user._id;

    // If user has liked the comment, remove their like; otherwise, add it
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId); // Unlike
    } else {
      comment.likes.push(userId); // Like
    }

    await comment.save();

    // Populate author username in response
    const populated = await comment.populate('author', 'username');
    res.json(populated);
  } catch (err) {
    console.error('Toggle like comment error:', err);
    res.status(500).json({ message: 'Failed to toggle like', error: err.message });
  }
};
