const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getJobs,
  getJob,
  applyToJob,
  getApplications,
  getInternships,
  getWebinars,
  getDashboard
} = require('../controllers/studentController');

// All routes are protected and authorized for students only
router.use(protect);
router.use(authorize('student'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Jobs routes
router.get('/jobs', getJobs);
router.get('/job/:id', getJob);
router.post('/apply/:jobId', applyToJob);

// Applications
router.get('/applications', getApplications);

// Internships & Webinars
router.get('/internships', getInternships);
router.get('/webinars', getWebinars);

// Dashboard
router.get('/dashboard', getDashboard);

module.exports = router;
