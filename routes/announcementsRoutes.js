const express = require('express');
const router = express.Router();
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
} = require('../controller/announcementController');
const { authenticateAlumni } = require('../middleware/auth');

router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncementById);

router.post('/', authenticateAlumni, createAnnouncement);

module.exports = router;