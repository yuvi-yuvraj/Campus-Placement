const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add internship title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please add company name'],
    trim: true
  },
  link: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  duration: {
    type: String,
    default: ''
  },
  stipend: {
    type: String,
    default: 'Unpaid'
  },
  location: {
    type: String,
    default: 'Remote'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Internship', internshipSchema);
