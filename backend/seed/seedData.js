const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const JobPosting = require('../models/JobPosting');
const Internship = require('../models/Internship');
const Webinar = require('../models/Webinar');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Student.deleteMany({});
    await Admin.deleteMany({});
    await JobPosting.deleteMany({});
    await Internship.deleteMany({});
    await Webinar.deleteMany({});

    console.log('Cleared existing data...');

    // Create Admin
    const admin = await Admin.create({
      email: 'admin@campus.edu',
      password: 'admin123',
      name: 'Placement Officer',
      role: 'admin'
    });
    console.log('Admin created: admin@campus.edu / admin123');

    // Create Students
    const students = await Student.create([
      {
        name: 'Rahul Kumar',
        email: 'rahul@student.edu',
        password: 'student123',
        phone: '9876543210',
        dept: 'CSE',
        year: 2025,
        cgpa: 8.5,
        backlogs: 0,
        resumeLink: 'https://drive.google.com/resume/rahul',
        skills: ['JavaScript', 'React', 'Node.js', 'Python']
      },
      {
        name: 'Priya Sharma',
        email: 'priya@student.edu',
        password: 'student123',
        phone: '9876543211',
        dept: 'ECE',
        year: 2025,
        cgpa: 7.8,
        backlogs: 0,
        resumeLink: 'https://drive.google.com/resume/priya',
        skills: ['VLSI', 'Embedded Systems', 'C++']
      },
      {
        name: 'Amit Singh',
        email: 'amit@student.edu',
        password: 'student123',
        phone: '9876543212',
        dept: 'CSE',
        year: 2025,
        cgpa: 6.5,
        backlogs: 2,
        resumeLink: 'https://drive.google.com/resume/amit',
        skills: ['Java', 'Android', 'SQL']
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@student.edu',
        password: 'student123',
        phone: '9876543213',
        dept: 'IT',
        year: 2026,
        cgpa: 9.0,
        backlogs: 0,
        resumeLink: 'https://drive.google.com/resume/sneha',
        skills: ['Python', 'Machine Learning', 'TensorFlow']
      },
      {
        name: 'Vikram Reddy',
        email: 'vikram@student.edu',
        password: 'student123',
        phone: '9876543214',
        dept: 'ME',
        year: 2025,
        cgpa: 7.2,
        backlogs: 1,
        resumeLink: 'https://drive.google.com/resume/vikram',
        skills: ['AutoCAD', 'SolidWorks', 'MATLAB']
      }
    ]);
    console.log(`${students.length} students created`);

    // Create Job Postings
    const jobs = await JobPosting.create([
      {
        title: 'Software Development Engineer',
        company: 'Google',
        description: 'Join our team to work on cutting-edge technology products. You will be responsible for designing, developing, and maintaining software systems.',
        package: '25-35 LPA',
        applicationLink: '',
        location: 'Bangalore',
        jobType: 'Full-time',
        criteria: {
          minCGPA: 8.0,
          allowBacklogs: false,
          departmentList: ['CSE', 'IT', 'ECE'],
          yearList: [2025]
        },
        isActive: true,
        deadline: new Date('2025-01-15')
      },
      {
        title: 'Frontend Developer',
        company: 'Microsoft',
        description: 'We are looking for passionate frontend developers to create beautiful user interfaces for our products.',
        package: '18-25 LPA',
        applicationLink: '',
        location: 'Hyderabad',
        jobType: 'Full-time',
        criteria: {
          minCGPA: 7.5,
          allowBacklogs: false,
          departmentList: ['CSE', 'IT'],
          yearList: [2025]
        },
        isActive: true,
        deadline: new Date('2025-01-20')
      },
      {
        title: 'Data Analyst',
        company: 'Amazon',
        description: 'Analyze large datasets to derive insights and support business decisions.',
        package: '15-20 LPA',
        applicationLink: '',
        location: 'Chennai',
        jobType: 'Full-time',
        criteria: {
          minCGPA: 7.0,
          allowBacklogs: true,
          departmentList: ['CSE', 'IT', 'ECE', 'EEE'],
          yearList: [2025, 2026]
        },
        isActive: true,
        deadline: new Date('2025-02-01')
      },
      {
        title: 'Mechanical Design Engineer',
        company: 'Tata Motors',
        description: 'Design and develop automotive components and systems.',
        package: '8-12 LPA',
        applicationLink: '',
        location: 'Pune',
        jobType: 'Full-time',
        criteria: {
          minCGPA: 6.5,
          allowBacklogs: true,
          departmentList: ['ME', 'CE'],
          yearList: [2025]
        },
        isActive: true,
        deadline: new Date('2025-01-25')
      },
      {
        title: 'Full Stack Developer',
        company: 'Flipkart',
        description: 'Build and maintain scalable web applications using modern technologies.',
        package: '12-18 LPA',
        applicationLink: '',
        location: 'Bangalore',
        jobType: 'Full-time',
        criteria: {
          minCGPA: 7.0,
          allowBacklogs: false,
          departmentList: ['CSE', 'IT'],
          yearList: [2025]
        },
        isActive: true,
        deadline: new Date('2025-01-30')
      }
    ]);
    console.log(`${jobs.length} job postings created`);

    // Create Internships
    const internships = await Internship.create([
      {
        title: 'Summer Internship - Software Engineering',
        company: 'Infosys',
        link: 'https://infosys.com/careers/internship',
        description: '2-month summer internship program for pre-final year students.',
        duration: '2 months',
        stipend: '₹25,000/month',
        location: 'Mysore',
        isActive: true
      },
      {
        title: 'Winter Internship - Web Development',
        company: 'TCS',
        link: 'https://tcs.com/careers/internship',
        description: 'Learn web development technologies in a hands-on environment.',
        duration: '6 weeks',
        stipend: '₹15,000/month',
        location: 'Mumbai',
        isActive: true
      },
      {
        title: 'Research Internship - AI/ML',
        company: 'IIT Research Lab',
        link: 'https://iit.edu/research/internship',
        description: 'Work on cutting-edge AI research projects with professors.',
        duration: '3 months',
        stipend: '₹30,000/month',
        location: 'Delhi',
        isActive: true
      }
    ]);
    console.log(`${internships.length} internships created`);

    // Create Webinars
    const webinars = await Webinar.create([
      {
        title: 'How to Crack Product-Based Company Interviews',
        speaker: 'John Doe (Ex-Google)',
        date: new Date('2025-01-10'),
        time: '6:00 PM IST',
        link: 'https://zoom.us/webinar/123',
        description: 'Learn interview strategies and tips from an industry expert.',
        platform: 'Zoom',
        isActive: true
      },
      {
        title: 'Resume Building Workshop',
        speaker: 'HR Team - Placement Cell',
        date: new Date('2025-01-05'),
        time: '4:00 PM IST',
        link: 'https://meet.google.com/resume-workshop',
        description: 'Interactive session on creating ATS-friendly resumes.',
        platform: 'Google Meet',
        isActive: true
      },
      {
        title: 'Introduction to Cloud Computing',
        speaker: 'AWS Solutions Architect',
        date: new Date('2025-01-15'),
        time: '5:00 PM IST',
        link: 'https://zoom.us/webinar/cloud',
        description: 'Understanding cloud infrastructure and career opportunities.',
        platform: 'Zoom',
        isActive: true
      }
    ]);
    console.log(`${webinars.length} webinars created`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Admin Login: admin@campus.edu / admin123');
    console.log('📧 Student Login: rahul@student.edu / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
