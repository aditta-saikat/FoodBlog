const Like = require('../models/Like');
const Blog = require('../models/Blog');

exports.toggleLike = async (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const existing = await Like.findOne({ blogId, userId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ message: 'Unliked successfully' });
    } else {
      await Like.create({ blogId, userId });
      return res.status(201).json({ message: 'Liked successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLikesCount = async (req, res) => {
  const blogId = req.params.blogId;

  try {
    const likes = await Like.find({ blogId }).exec();
    const count = likes.length;
    res.status(200).json({ totalLikes: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.hasLiked = async (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user._id;

  try {
    const liked = await Like.exists({ blogId, userId });
    res.status(200).json({ liked: !!liked });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsersWhoLiked = async (req, res) => {
  const blogId = req.params.blogId;

  try {
    const likes = await Like.find({ blogId }).populate('userId', 'username email avatarUrl');
    res.status(200).json({ users: likes.map(like => like.userId) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};