// In controllers/userController.js

const User = require('../models/User');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

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
  if (req.user.id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  try {
    console.log('Server: Received update request');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files object');
    
    // Parse text fields from req.body.data
    let { username, bio } = req.body.data ? JSON.parse(req.body.data) : {};
    
    console.log('Parsed data:', { username, bio });
    
    let avatarUrl = undefined;
    
    // Handle image upload
    if (req.files && req.files.image) {
      console.log('Server: Processing image upload');
      const file = req.files.image;
      
      console.log('Image details:', {
        name: file.name,
        size: file.size,
        mimetype: file.mimetype,
        hasData: !!file.data
      });
      
      if (!file.data || !file.name || !file.mimetype) {
        return res.status(400).json({ message: 'Invalid image file' });
      }
      
      const formData = new FormData();
      formData.append('image', file.data, {
        filename: file.name,
        contentType: file.mimetype,
      });
      formData.append('key', process.env.IMGBB_API_KEY);
      
      console.log('Server: Sending request to ImgBB');
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });
      
      const imgbbResponse = await response.json();
      console.log('ImgBB response success:', imgbbResponse.success);
      
      if (!imgbbResponse.success) {
        console.error('ImgBB error:', imgbbResponse.error);
        return res.status(400).json({ 
          message: `Image upload failed: ${imgbbResponse.error?.message || 'Unknown error'}` 
        });
      }
      
      avatarUrl = imgbbResponse.data.url;
      console.log('Image successfully uploaded to:', avatarUrl);
    }
    
    // Only update provided fields
    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    
    console.log('Update data:', updateData);
    
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User successfully updated');
    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(400).json({ message: 'Update failed', error: err.message });
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