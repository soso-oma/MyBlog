// backend/models/Post.js
import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

// Define schema for blog posts
const postSchema = new mongoose.Schema(
  {
    // Post title 
    title: { type: String, required: true },

    // URL-friendly identifier generated from title
    slug: { type: String, unique: true },

    // Main body/content of the post
    content: { type: String, required: true },

    // Optional image URL for the post
    image: { type: String },

    // Category of the post; defaults to "General"
    category: { type: String, default: "General" },

    // Reference to the User who created the post
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Array of users who liked this post
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    // Automatically include createdAt and updatedAt fields
    timestamps: true,
  }
);

// Middleware to generate slug from title before validation
postSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title);
  }
  next();
});

// Export model (handle hot-reload issues in dev with fallback)
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
