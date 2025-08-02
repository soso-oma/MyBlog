// backend/models/Post.js
import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // URL-friendly identifier generated from title
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    image: { type: String },
    category: { type: String, default: "General" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
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

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
