const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put(
  '/profile',
  auth,
  upload.single('avatar'),
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('email').optional().isEmail(),
    body('bio').optional().trim(),
  ],
  userController.updateProfile
);

module.exports = router; 