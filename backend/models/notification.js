import mongoose from 'mongoose';

// Define the schema for notifications
const notificationSchema = new mongoose.Schema(
  {
    // Type of notification: like, comment, or follow
    type: {
      type: String,
      enum: ['like', 'comment', 'follow'],
      required: true,
    },
    // The user who triggered the notification
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The user who receives the notification
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The post that the notification is related to (nullable for follow notifications)
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    // Flag to check if the notification has been read
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Safely export model
export default mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);
