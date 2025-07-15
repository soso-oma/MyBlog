import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
