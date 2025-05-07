const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const {verifyToken} = require('../middleware/authMiddleware')
const upload = require('../middleware/multer');

// Blog routes
router.post('/', verifyToken, blogController.createBlog);
router.get('/', verifyToken, blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', verifyToken, blogController.updateBlog);
router.delete('/:id', verifyToken, blogController.deleteBlog);

module.exports =  router;