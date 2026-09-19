const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://campus-placement-backend-5w4p.onrender.com'],
  credentials: true
}));

// API Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/student', require('./routes/studentRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Placement API is running',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
