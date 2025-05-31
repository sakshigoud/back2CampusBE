const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controller/authController.js');
const { authenticateAlumni } = require('../middleware/auth.js');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticateAlumni, getProfile);
router.put('/profile', authenticateAlumni, updateProfile);

module.exports = router;