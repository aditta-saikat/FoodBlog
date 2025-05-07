const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/toggle/:blogId', verifyToken, likeController.toggleLike);
router.get('/count/:blogId', likeController.getLikesCount);
router.get('/has-liked/:blogId', verifyToken, likeController.hasLiked);
router.get('/users/:blogId', likeController.getUsersWhoLiked);

module.exports = router;
