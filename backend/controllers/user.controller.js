const User = require('../models/User');

// GET /api/users/:id - get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/users/:id - update user profile
exports.updateUser = async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const { username, bio, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, avatar },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE /api/users/:id - delete user
exports.deleteUser = async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// GET /api/users - get all users (admin only)
exports.getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};
