const Student = require('../models/Student');
const JobPosting = require('../models/JobPosting');
const Internship = require('../models/Internship');
const Webinar = require('../models/Webinar');
const Application = require('../models/Application');

// @desc    Get student profile
// @route   GET /student/profile
// @access  Private (Student)
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update student profile
// @route   PUT /student/profile
// @access  Private (Student)
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      dept: req.body.dept,
      year: req.body.year,
      cgpa: req.body.cgpa,
      backlogs: req.body.backlogs,
      resumeLink: req.body.resumeLink,
      skills: req.body.skills
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all jobs
// @route   GET /student/jobs
// @access  Private (Student)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.find({ isActive: true }).sort({ postedAt: -1 });
    
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

// @desc    Get single job
// @route   GET /student/job/:id
// @access  Private (Student)
exports.getJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      studentId: req.user._id,
      jobId: job._id
    });

    res.status(200).json({
      success: true,
      data: job,
      hasApplied: !!existingApplication,
      applicationStatus: existingApplication ? existingApplication.status : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Apply to job
// @route   POST /student/apply/:jobId
// @access  Private (Student)
exports.applyToJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      studentId: req.user._id,
      jobId: job._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    const student = req.user;

    // Validate criteria
    // Check CGPA
    if (job.criteria.minCGPA && student.cgpa < job.criteria.minCGPA) {
      return res.status(400).json({
        success: false,
        message: `Minimum CGPA required: ${job.criteria.minCGPA}. Your CGPA: ${student.cgpa}`
      });
    }

    // Check backlogs
    if (!job.criteria.allowBacklogs && student.backlogs > 0) {
      return res.status(400).json({
        success: false,
        message: 'This job does not allow students with backlogs'
      });
    }

    // Check department
    if (job.criteria.departmentList && job.criteria.departmentList.length > 0) {
      if (!job.criteria.departmentList.includes(student.dept)) {
        return res.status(400).json({
          success: false,
          message: `This job is only for: ${job.criteria.departmentList.join(', ')} departments`
        });
      }
    }

    // Check year
    if (job.criteria.yearList && job.criteria.yearList.length > 0) {
      if (!job.criteria.yearList.includes(student.year)) {
        return res.status(400).json({
          success: false,
          message: `This job is only for passout years: ${job.criteria.yearList.join(', ')}`
        });
      }
    }

    // Create application
    const application = await Application.create({
      studentId: student._id,
      jobId: job._id,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student applications
// @route   GET /student/applications
// @access  Private (Student)
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId', 'title company package location')
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

// @desc    Get all internships
// @route   GET /student/internships
// @access  Private (Student)
exports.getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ isActive: true }).sort({ postedAt: -1 });
    
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

// @desc    Get all webinars
// @route   GET /student/webinars
// @access  Private (Student)
exports.getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({ isActive: true }).sort({ date: 1 });
    
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

// @desc    Get student dashboard stats
// @route   GET /student/dashboard
// @access  Private (Student)
exports.getDashboard = async (req, res) => {
  try {
    const totalJobs = await JobPosting.countDocuments({ isActive: true });
    const totalInternships = await Internship.countDocuments({ isActive: true });
    const totalWebinars = await Webinar.countDocuments({ isActive: true });
    const myApplications = await Application.countDocuments({ studentId: req.user._id });
    const pendingApplications = await Application.countDocuments({ 
      studentId: req.user._id, 
      status: 'Pending' 
    });
    const approvedApplications = await Application.countDocuments({ 
      studentId: req.user._id, 
      status: 'Approved' 
    });

    // Get recent jobs
    const recentJobs = await JobPosting.find({ isActive: true })
      .sort({ postedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalInternships,
        totalWebinars,
        myApplications,
        pendingApplications,
        approvedApplications,
        recentJobs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
