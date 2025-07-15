import Post from "../models/Post.js";
import Notification from "../models/notification.js";
import slugify from "../utils/slugify.js";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

// Create a new blog post
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = new Post({
      title,
      content,
      category,
      author: req.user._id,
    });

    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    if (!post.slug) {
      post.slug = slugify(title);
    }

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(400).json({ message: err.message });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username _id")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a post by slug
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("author", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    if (req.body.title) {
      post.slug = slugify(req.body.title);
    }

    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (post.image && post.image.startsWith("/uploads/")) {
      const imagePath = path.join("backend", post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like or unlike a post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);

      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          type: "like",
          sender: userId,
          receiver: post.author,
          post: post._id,
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle like", error: err.message });
  }
};

// Get posts by user ID (for profile)
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username _id")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user's posts", error: err.message });
  }
};

// Get posts by username (for profile by username)
const getPostsByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: user._id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts", error: err.message });
  }
};

// Search posts
const getSearchResults = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).populate("author", "username");

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

export {
  createPost,
  getPosts,
  getPostBySlug,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getPostsByUser,
  getPostsByUsername,
  getSearchResults,
};
