const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  toggleSave,
  getSavedBlogs
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);

// Protected routes
router.get('/saved', auth, getSavedBlogs);
router.post('/', [auth, upload.single('image')], createBlog);
router.get('/:id', getBlog);
router.put('/:id', [auth, upload.single('image')], updateBlog);
router.delete('/:id', auth, deleteBlog);
router.post('/:id/like', auth, toggleLike);
router.post('/:id/save', auth, toggleSave);

module.exports = router; 