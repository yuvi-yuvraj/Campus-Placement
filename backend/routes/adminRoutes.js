const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  // Job management
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobApplicants,
  approveApplication,
  rejectApplication,
  // Internship management
  createInternship,
  updateInternship,
  deleteInternship,
  getAllInternships,
  // Webinar management
  createWebinar,
  updateWebinar,
  deleteWebinar,
  getAllWebinars,
  // Dashboard
  getDashboard
} = require('../controllers/adminController');

// All routes are protected and authorized for admin only
router.use(protect);
router.use(authorize('admin'));

// Job routes
router.post('/job', createJob);
router.put('/job/:id', updateJob);
router.delete('/job/:id', deleteJob);
router.get('/jobs', getAllJobs);
router.get('/job/applicants/:jobId', getJobApplicants);

// Application management
router.post('/application/:id/approve', approveApplication);
router.post('/application/:id/reject', rejectApplication);

// Internship routes
router.post('/internship', createInternship);
router.put('/internship/:id', updateInternship);
router.delete('/internship/:id', deleteInternship);
router.get('/internships', getAllInternships);

// Webinar routes
router.post('/webinar', createWebinar);
router.put('/webinar/:id', updateWebinar);
router.delete('/webinar/:id', deleteWebinar);
router.get('/webinars', getAllWebinars);

// Dashboard
router.get('/dashboard', getDashboard);

module.exports = router;
