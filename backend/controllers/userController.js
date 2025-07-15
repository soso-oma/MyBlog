// controllers/userController.js
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import User from '../models/User.js';
import Notification from '../models/notification.js';

// GET user profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const updates = {};
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog-profile-pictures',
      });
      updates.profilePicture = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FOLLOW
export const followUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.user.id);

    if (!target || target._id.equals(current._id)) {
      return res.status(400).json({ message: 'Invalid follow request' });
    }

    if (!target.followers.includes(current._id)) {
      target.followers.push(current._id);
      current.following.push(target._id);
      await target.save();
      await current.save();

      await Notification.create({
        type: 'follow',
        sender: current._id,
        receiver: target._id,
        post: null,
      });

      return res.json({ message: 'User followed successfully' });
    }

    res.status(400).json({ message: 'Already following' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UNFOLLOW
export const unfollowUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.user.id);

    if (!target.followers.includes(current._id)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    target.followers.pull(current._id);
    current.following.pull(target._id);
    await target.save();
    await current.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET user by username
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH users by username or name
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Missing search query' });

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).select('username name profilePicture');

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get following of a user
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.following);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
