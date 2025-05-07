const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, notificationController.getMyNotifications);
router.patch('/:id/read', verifyToken, notificationController.markAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;
