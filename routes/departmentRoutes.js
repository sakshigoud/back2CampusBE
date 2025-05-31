const express = require('express');
const router = express.Router();
const Department = require('../models/Department');


router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, code } = req.body;

    const department = new Department({ name, code });
    const savedDepartment = await department.save();

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: savedDepartment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Department name or code already exists'
      });
    }

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
      message: 'Error creating department',
      error: error.message
    });
  }
});

module.exports = router;