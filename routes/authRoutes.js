const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { authenticateAlumni } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticateAlumni, getProfile);
router.put('/profile', authenticateAlumni, updateProfile);

module.exports = router;