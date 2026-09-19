const Student = require('../models/Student');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

// @desc    Register student
// @route   POST /auth/student/register
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, dept, year, cgpa, backlogs, resumeLink, skills } = req.body;

    // Check if student exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      password,
      phone,
      dept,
      year,
      cgpa,
      backlogs: backlogs || 0,
      resumeLink,
      skills: skills || []
    });

    // Generate tokens
    const token = generateToken(student._id, 'student');
    const refreshToken = generateRefreshToken(student._id, 'student');

    // Save refresh token
    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      refreshToken,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        dept: student.dept,
        year: student.year,
        cgpa: student.cgpa,
        role: 'student'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login student
// @route   POST /auth/student/login
// @access  Public
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for student
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const token = generateToken(student._id, 'student');
    const refreshToken = generateRefreshToken(student._id, 'student');

    // Save refresh token
    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        dept: student.dept,
        year: student.year,
        cgpa: student.cgpa,
        role: 'student'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login admin
// @route   POST /auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const token = generateToken(admin._id, 'admin');
    const refreshToken = generateRefreshToken(admin._id, 'admin');

    // Save refresh token
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      refreshToken,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Refresh token
// @route   POST /auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    let user;
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('+refreshToken');
    } else {
      user = await Student.findById(decoded.id).select('+refreshToken');
    }

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id, decoded.role);
    const newRefreshToken = generateRefreshToken(user._id, decoded.role);

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};
