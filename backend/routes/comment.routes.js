const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.verifyToken, commentController.createComment);
router.get('/:blogId', commentController.getCommentsByBlog);
router.delete('/:id', authMiddleware.verifyToken, commentController.deleteComment);

module.exports = router;