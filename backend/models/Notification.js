const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
  isRead: { type: Boolean, default: false },
  message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
