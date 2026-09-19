const mongoose = require('mongoose');

const webinarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add webinar title'],
    trim: true
  },
  speaker: {
    type: String,
    required: [true, 'Please add speaker name'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add webinar date']
  },
  time: {
    type: String,
    required: [true, 'Please add webinar time']
  },
  link: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  platform: {
    type: String,
    default: 'Zoom'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Webinar', webinarSchema);
