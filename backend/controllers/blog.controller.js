const Blog = require('../models/Blog');
const Like = require('../models/Like');
const fetch = require('node-fetch');
const FormData = require('form-data');

exports.getAllBlogs = async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    let query = {};

    if (filter === 'my') {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      }
      query.author = req.user._id;
    } else if (filter === 'featured') {
      query.isFeatured = true;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username email avatarUrl')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username avatarUrl' }
      })
      .sort({ createdAt: -1 });

    const blogsWithLikes = await Promise.all(
      blogs.map(async (blog) => {
        const likes = await Like.find({ blogId: blog._id }).exec();
        const totalLikes = likes.length;
        const hasLiked = req.user
          ? !!(await Like.exists({ blogId: blog._id, userId: req.user._id }))
          : false;
        return {
          ...blog.toObject(),
          totalLikes,
          hasLiked
        };
      })
    );

    res.status(200).json(blogsWithLikes);
  } catch (err) {
    console.error('Error fetching blogs:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {

    if (!req.body || !req.body.data) {
      return res.status(400).json({ message: 'Missing data field in request body' });
    }

    const { title, content, restaurant, location, rating, tags } = JSON.parse(req.body.data);
    const imageUrls = [];

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of files) {
        if (!file.data || !file.name || !file.mimetype) {
          console.error('Invalid file object:', file);
          throw new Error('Invalid file data: missing data, name, or mimetype');
        }

        const formData = new FormData();
        formData.append('image', file.data, {
          filename: file.name,
          contentType: file.mimetype
        });
        formData.append('key', process.env.IMGBB_API_KEY);

       
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData
        });
        const imgbbResponse = await response.json();
        

        if (imgbbResponse.success) {
          imageUrls.push(imgbbResponse.data.url);
        } else {
          throw new Error(`ImageBB upload failed: ${imgbbResponse.error.message}`);
        }
      }
    }

    if (!title || !content || !restaurant || !rating) {
      return res.status(400).json({ message: 'Required fields: title, content, restaurant, rating' });
    }

    const newBlog = await Blog.create({
      title,
      content,
      restaurant,
      location: location || '',
      rating: Number(rating),
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images: imageUrls,
      author: req.user._id
    });

    await newBlog.populate('author', 'username avatarUrl');

    const likes = await Like.find({ blogId: newBlog._id }).exec();
    const totalLikes = likes.length;
    const hasLiked = false;


    res.status(201).json({
      message: 'Blog created',
      blog: {
        _id: newBlog._id,
        title: newBlog.title,
        content: newBlog.content,
        restaurant: newBlog.restaurant,
        location: newBlog.location,
        rating: newBlog.rating,
        tags: newBlog.tags,
        images: newBlog.images,
        author: {
          _id: newBlog.author._id,
          username: newBlog.author.username,
          avatarUrl: newBlog.author.avatarUrl || '/api/placeholder/32/32'
        },
        createdAt: newBlog.createdAt,
        comments: newBlog.comments,
        isFeatured: newBlog.isFeatured,
        totalLikes,
        hasLiked
      }
    });
  } catch (err) {
    console.error('Error in createBlog:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email avatarUrl')
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username avatarUrl' }
      });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const likes = await Like.find({ blogId: blog._id }).exec();
    const totalLikes = likes.length;
    const hasLiked = req.user
      ? !!(await Like.exists({ blogId: blog._id, userId: req.user._id }))
      : false;

    res.status(200).json({
      ...blog.toObject(),
      totalLikes,
      hasLiked
    });
  } catch (err) {
    console.error('Error fetching blog:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, content, images, tags, category, rating, isFeatured } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.images = images || blog.images;
    blog.tags = tags || blog.tags;
    blog.category = category || blog.category;
    blog.rating = rating !== undefined ? rating : blog.rating;
    blog.isFeatured = isFeatured !== undefined ? isFeatured : blog.isFeatured;

    await blog.save();

    const likes = await Like.find({ blogId: blog._id }).exec();
    const totalLikes = likes.length;
    const hasLiked = !!(await Like.exists({ blogId: blog._id, userId: req.user._id }));

    res.status(200).json({
      message: 'Blog updated successfully',
      blog: {
        ...blog.toObject(),
        totalLikes,
        hasLiked
      }
    });
  } catch (err) {
    console.error('Error updating blog:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Like.deleteMany({ blogId: blog._id });
    await blog.remove();

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};