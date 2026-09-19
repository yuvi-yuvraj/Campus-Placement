const JobPosting = require('../models/JobPosting');
const Internship = require('../models/Internship');
const Webinar = require('../models/Webinar');
const Application = require('../models/Application');
const Student = require('../models/Student');

// ==================== JOB MANAGEMENT ====================

// @desc    Create job posting
// @route   POST /admin/job
// @access  Private (Admin)
exports.createJob = async (req, res) => {
  try {
    const job = await JobPosting.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update job posting
// @route   PUT /admin/job/:id
// @access  Private (Admin)
exports.updateJob = async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete job posting
// @route   DELETE /admin/job/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPosting.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Also delete related applications
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all jobs (admin)
// @route   GET /admin/jobs
// @access  Private (Admin)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.find().sort({ postedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get job applicants
// @route   GET /admin/job/applicants/:jobId
// @access  Private (Admin)
exports.getJobApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email phone dept year cgpa backlogs resumeLink skills')
      .populate('jobId', 'title company')
      .sort({ appliedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve application
// @route   POST /admin/application/:id/approve
// @access  Private (Admin)
exports.approveApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Approved',
        remarks: req.body.remarks || 'Your application has been approved',
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('studentId', 'name email')
     .populate('jobId', 'title company');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject application
// @route   POST /admin/application/:id/reject
// @access  Private (Admin)
exports.rejectApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Rejected',
        remarks: req.body.remarks || 'Your application has been rejected',
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('studentId', 'name email')
     .populate('jobId', 'title company');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== INTERNSHIP MANAGEMENT ====================

// @desc    Create internship
// @route   POST /admin/internship
// @access  Private (Admin)
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update internship
// @route   PUT /admin/internship/:id
// @access  Private (Admin)
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: internship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete internship
// @route   DELETE /admin/internship/:id
// @access  Private (Admin)
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all internships (admin)
// @route   GET /admin/internships
// @access  Private (Admin)
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({ postedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== WEBINAR MANAGEMENT ====================

// @desc    Create webinar
// @route   POST /admin/webinar
// @access  Private (Admin)
exports.createWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Webinar created successfully',
      data: webinar
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update webinar
// @route   PUT /admin/webinar/:id
// @access  Private (Admin)
exports.updateWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: 'Webinar not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Webinar updated successfully',
      data: webinar
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete webinar
// @route   DELETE /admin/webinar/:id
// @access  Private (Admin)
exports.deleteWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndDelete(req.params.id);
    
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: 'Webinar not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Webinar deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all webinars (admin)
// @route   GET /admin/webinars
// @access  Private (Admin)
exports.getAllWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find().sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: webinars.length,
      data: webinars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== DASHBOARD ====================

// @desc    Get admin dashboard stats
// @route   GET /admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
  try {
    const totalJobs = await JobPosting.countDocuments();
    const activeJobs = await JobPosting.countDocuments({ isActive: true });
    const totalInternships = await Internship.countDocuments();
    const totalWebinars = await Webinar.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const approvedApplications = await Application.countDocuments({ status: 'Approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'Rejected' });

    // Recent applications
    const recentApplications = await Application.find()
      .populate('studentId', 'name email dept')
      .populate('jobId', 'title company')
      .sort({ appliedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        totalInternships,
        totalWebinars,
        totalStudents,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        recentApplications
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
