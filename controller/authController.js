const jwt = require('jsonwebtoken');
const Alumni = require('../models/Alumni');
const Department = require('../models/Department');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};


const register = async (req, res) => {
  try {
    const { name, batch, department, job_title, email, phone, password } = req.body;

    
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: 'Alumni with this email already exists'
      });
    }

    
    if (department) {
      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid department ID'
        });
      }
    }

    
    const alumni = new Alumni({
      name,
      batch,
      department,
      job_title,
      email,
      phone,
      password
    });

    const savedAlumni = await alumni.save();
    
    
    await savedAlumni.populate('department', 'name code');

    
    const token = generateToken(savedAlumni._id);

    
    const alumniResponse = savedAlumni.toObject();
    delete alumniResponse.password;

    res.status(201).json({
      success: true,
      message: 'Alumni registered successfully',
      data: {
        alumni: alumniResponse,
        token
      }
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
      message: 'Error registering alumni',
      error: error.message
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    
    const alumni = await Alumni.findOne({ email }).select('+password').populate('department', 'name code');
    
    if (!alumni) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    
    const isPasswordValid = await alumni.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    
    const token = generateToken(alumni._id);

    
    const alumniResponse = alumni.toObject();
    delete alumniResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        alumni: alumniResponse,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.alumni._id).populate('department', 'name code description');
    
    res.status(200).json({
      success: true,
      data: alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'batch', 'department', 'job_title', 'phone'];
    const updates = {};

    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    
    if (updates.department) {
      const departmentExists = await Department.findById(updates.department);
      if (!departmentExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid department ID'
        });
      }
    }

    const alumni = await Alumni.findByIdAndUpdate(
      req.alumni._id,
      updates,
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: alumni
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
      message: 'Error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};