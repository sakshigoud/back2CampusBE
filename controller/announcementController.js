const Announcement = require('../models/announcementSchema');


const getAllAnnouncements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const announcements = await Announcement.find()
      .populate('author', 'name batch department')
      .populate({
        path: 'author',
        populate: {
          path: 'department',
          select: 'name code'
        }
      })
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await Announcement.countDocuments();

    res.status(200).json({
      success: true,
      data: announcements,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_records: total,
        per_page: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements',
      error: error.message
    });
  }
};


const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name batch department')
      .populate({
        path: 'author',
        populate: {
          path: 'department',
          select: 'name code'
        }
      });
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching announcement',
      error: error.message
    });
  }
};


const createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const announcement = new Announcement({
      title,
      description,
      author: req.alumni._id
    });

    const savedAnnouncement = await announcement.save();
    
    
    await savedAnnouncement.populate('author', 'name batch department');
    await savedAnnouncement.populate({
      path: 'author',
      populate: {
        path: 'department',
        select: 'name code'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: savedAnnouncement
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating announcement',
      error: error.message
    });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement
};