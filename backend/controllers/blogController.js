const Blog = require('../models/Blog');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../config/cloudinary');

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, linkedBlogs } = req.body;
    const image = req.file ? req.file.path : null;

    const blog = new Blog({
      title,
      content,
      image,
      author: req.user.id,
      linkedBlogs: linkedBlogs ? JSON.parse(linkedBlogs) : []
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Create blog error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all blogs with pagination
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (err) {
    console.error('Get blogs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single blog
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name')
      .populate('linkedBlogs', 'title');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (err) {
    console.error('Get blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, content, linkedBlogs } = req.body;
    let image = blog.image;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (blog.image) {
        const publicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      image = req.file.path;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image;
    blog.linkedBlogs = linkedBlogs ? JSON.parse(linkedBlogs) : blog.linkedBlogs;

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Update blog error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete image from Cloudinary if it exists
    if (blog.image) {
      const publicId = blog.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like/Unlike blog
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const likeIndex = blog.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      blog.likes.push(req.user.id);
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save/Unsave blog
exports.toggleSave = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const saveIndex = blog.saves.indexOf(req.user.id);
    if (saveIndex === -1) {
      blog.saves.push(req.user.id);
    } else {
      blog.saves.splice(saveIndex, 1);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Toggle save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get saved blogs
exports.getSavedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ saves: req.user.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error('Get saved blogs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 