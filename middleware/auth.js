const jwt = require('jsonwebtoken');
const Alumni = require('../models/alumniSchema');

const authenticateAlumni = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const alumni = await Alumni.findById(decoded.id).select('-password');

    if (!alumni) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Alumni not found.'
      });
    }

    req.alumni = alumni;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

module.exports = { authenticateAlumni };