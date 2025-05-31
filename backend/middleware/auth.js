const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if token is in correct format
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid token format');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Get token without 'Bearer ' prefix
    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request
    req.user = user;
    console.log('User authenticated:', { id: user._id, name: user.name });
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 