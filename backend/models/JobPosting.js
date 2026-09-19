const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please add company name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add job description']
  },
  package: {
    type: String,
    required: [true, 'Please add package details']
  },
  applicationLink: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'On-site'
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  criteria: {
    minCGPA: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    allowBacklogs: {
      type: Boolean,
      default: true
    },
    departmentList: {
      type: [String],
      default: []
    },
    yearList: {
      type: [Number],
      default: []
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deadline: {
    type: Date
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);
