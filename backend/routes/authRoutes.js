const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  loginAdmin,
  refreshToken
} = require('../controllers/authController');

// Student auth routes
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

// Admin auth routes
router.post('/admin/login', loginAdmin);

// Token refresh
router.post('/refresh', refreshToken);

module.exports = router;
