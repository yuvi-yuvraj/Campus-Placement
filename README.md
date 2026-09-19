# 🎓 Campus Placement Management System

A full-stack **Campus Placement Management System** designed to streamline the placement process for students and placement administrators.

The platform provides separate **Student** and **Admin** modules for managing job opportunities, applications, internships, webinars, eligibility criteria, and application status.

---

## 🚀 Features

### 👨‍🎓 Student Module

* 🔐 Student registration and authentication
* 🔎 Browse job postings with search and filtering
* 📝 Apply for jobs with automatic eligibility validation
* 💼 Explore internship opportunities
* 📅 View and attend webinars/events
* 📊 Track job application status
* 👤 Update student profile
* 🎓 Manage CGPA, department, year, backlogs, and skills
* 📄 Add resume link
* 🔄 Automatic JWT token refresh

### 🛡️ Admin Module

* 🔐 Secure admin authentication
* 📊 Placement dashboard with statistics
* ➕ Create job postings
* ✏️ Edit job postings
* 🗑️ Delete job postings
* 🎯 Configure job eligibility criteria
* 👥 View applicants for each job
* ✅ Approve applications
* ❌ Reject applications
* 💼 Manage internship opportunities
* 📅 Create and manage webinars
* 📈 Monitor placement-related activities

---

## 🛠️ Tech Stack

| Layer             | Technology          |
| ----------------- | ------------------- |
| Frontend          | React 18, Vite      |
| Styling           | Tailwind CSS        |
| Backend           | Node.js, Express.js |
| Database          | MongoDB, Mongoose   |
| Authentication    | JWT                 |
| Password Security | bcryptjs            |
| API Communication | REST API            |
| Development       | Nodemon             |

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │      Backend API      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌────────────────┐         ┌────────────────┐
        │ JWT Auth       │         │ Role Middleware│
        │ Access/Refresh │         │ Admin/Student  │
        └────────────────┘         └────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ MongoDB + Mongoose   │
        │ Database             │
        └──────────────────────┘
```

---

## 📁 Project Structure

```text
campus-placement/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── studentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Student.js
│   │   ├── JobPosting.js
│   │   ├── Internship.js
│   │   ├── Webinar.js
│   │   └── Application.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── studentRoutes.js
│   │
│   ├── seed/
│   │   └── seedData.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

* **Node.js 18+**
* **npm**
* **MongoDB** or a MongoDB Atlas account
* Git

---

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd campus-placement
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
```

> ⚠️ Never commit your `.env` file or expose your database credentials and JWT secrets publicly.

---

### 3. Seed Sample Data

The project includes a seed script located at:

```text
backend/seed/seedData.js
```

Run:

```bash
node seed/seedData.js
```

The seed script creates:

* 1 Admin account
* 5 Student accounts
* 5 Job postings
* 3 Internship opportunities
* 3 Webinars

You should see:

```text
MongoDB Connected for seeding...
Cleared existing data...
Admin created: admin@campus.edu / admin123
5 students created
5 job postings created
3 internships created
3 webinars created

✅ Seed data created successfully!
```

> ⚠️ The seed script clears existing Student, Admin, Job Posting, Internship, and Webinar records before inserting sample data. Use it only for development/testing.

---

### 4. Start the Backend

From the `backend` folder:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

---

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Demo Credentials

### Admin

| Field    | Value              |
| -------- | ------------------ |
| Email    | `admin@campus.edu` |
| Password | `admin123`         |

### Student

| Field    | Value               |
| -------- | ------------------- |
| Email    | `rahul@student.edu` |
| Password | `student123`        |

Additional seeded student:

```text
Email: priya@student.edu
Password: student123
```

> ⚠️ These credentials are for local development/demo purposes only. Change them before deploying the application.

---

# 📡 API Documentation

## Authentication

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | `/auth/student/register` | Register a student   |
| POST   | `/auth/student/login`    | Student login        |
| POST   | `/auth/admin/login`      | Admin login          |
| POST   | `/auth/refresh`          | Refresh access token |

---

## 👨‍🎓 Student APIs

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/student/profile`      | Get student profile        |
| PUT    | `/student/profile`      | Update student profile     |
| GET    | `/student/dashboard`    | Get dashboard data         |
| GET    | `/student/jobs`         | Get available jobs         |
| GET    | `/student/job/:id`      | Get job details            |
| POST   | `/student/apply/:jobId` | Apply for a job            |
| GET    | `/student/applications` | Get student's applications |
| GET    | `/student/internships`  | Get internships            |
| GET    | `/student/webinars`     | Get webinars               |

---

## 🛡️ Admin APIs

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/admin/dashboard`               | Get dashboard statistics |
| GET    | `/admin/jobs`                    | Get all jobs             |
| POST   | `/admin/job`                     | Create a job             |
| PUT    | `/admin/job/:id`                 | Update a job             |
| DELETE | `/admin/job/:id`                 | Delete a job             |
| GET    | `/admin/job/applicants/:jobId`   | View job applicants      |
| POST   | `/admin/application/:id/approve` | Approve application      |
| POST   | `/admin/application/:id/reject`  | Reject application       |
| POST   | `/admin/internship`              | Create internship        |
| PUT    | `/admin/internship/:id`          | Update internship        |
| DELETE | `/admin/internship/:id`          | Delete internship        |
| POST   | `/admin/webinar`                 | Create webinar           |
| PUT    | `/admin/webinar/:id`             | Update webinar           |
| DELETE | `/admin/webinar/:id`             | Delete webinar           |

---

# 🔒 Authentication & Authorization

The application uses **JWT-based authentication** with access and refresh tokens.

### Authentication Flow

```text
User Login
    ↓
Validate Email & Password
    ↓
Compare Password using bcrypt
    ↓
Generate Access Token
    ↓
Generate Refresh Token
    ↓
Return Authentication Response
    ↓
Access Protected APIs
    ↓
Refresh Access Token When Required
```

### Role-Based Access

The system supports two roles:

```text
Student
   │
   └── Student APIs

Admin
   │
   └── Admin APIs
```

Protected routes verify the JWT and ensure that the user has the required role.

---

# ✅ Job Eligibility Validation

Before allowing a student to apply for a job, the backend validates the student's eligibility.

### 1. CGPA Requirement

The student's CGPA must satisfy the minimum CGPA specified by the company.

```text
Student CGPA >= Required CGPA
```

### 2. Backlog Requirement

If the company does not allow backlogs:

```text
Student Backlogs = 0
```

### 3. Department Requirement

The student's department must be included in the job's eligible department list.

### 4. Graduation Year

The student's graduation/passout year must satisfy the job's eligibility criteria.

### 5. Duplicate Application Prevention

A student cannot apply for the same job more than once.

---

# 🎨 UI Features

The frontend is designed with a modern dashboard-oriented interface.

* 🌙 Dark-themed interface
* 💜 Indigo/purple visual accents
* 🪟 Glassmorphism UI
* 📱 Responsive design
* ✨ Smooth animations
* 🔔 Toast notifications
* ⏳ Loading states
* 📊 Dashboard statistics
* 🔎 Search and filtering
* 📋 Interactive tables and cards

---

# 🗄️ Database Schema

## Student

```javascript
{
  name,
  email,
  password,
  phone,
  dept,
  year,
  cgpa,
  backlogs,
  resumeLink,
  skills: [],
  refreshToken
}
```

## Admin

```javascript
{
  name,
  email,
  password,
  role,
  refreshToken,
  createdAt
}
```

## JobPosting

```javascript
{
  title,
  company,
  description,
  package,
  applicationLink,
  location,
  jobType,
  criteria: {
    minCGPA,
    allowBacklogs,
    departmentList: [],
    yearList: []
  },
  isActive,
  deadline,
  postedAt
}
```

## Application

```javascript
{
  studentId,
  jobId,
  status,
  remarks,
  appliedAt
}
```

## Internship

```javascript
{
  title,
  company,
  description,
  location,
  duration,
  applicationLink,
  deadline
}
```

## Webinar

```javascript
{
  title,
  description,
  speaker,
  date,
  time,
  meetingLink
}
```

---

# 🔄 Application Workflow

```text
Student
   │
   ▼
Browse Jobs
   │
   ▼
View Job Details
   │
   ▼
Eligibility Check
   │
   ├── Not Eligible ──► Application Rejected
   │
   ▼
Apply
   │
   ▼
Application Submitted
   │
   ▼
Admin Reviews Application
   │
   ├── Approve
   │
   └── Reject
   │
   ▼
Student Tracks Status
```

---

# 🧪 Development

### Run Backend

```bash
cd backend
npm run dev
```

### Run Frontend

```bash
cd frontend
npm run dev
```

### Seed Database

```bash
cd backend
node seed/seedData.js
```

---

# 🚀 Future Improvements

Potential future enhancements include:

* 📧 Email notifications for application updates
* 📄 Resume upload and resume parsing
* 🤖 AI-powered resume analysis
* 🎯 AI-based job recommendations
* 📊 Advanced placement analytics
* 📥 Export applicants to CSV/Excel
* 🔔 Real-time notifications
* 🏢 Company/recruiter accounts
* 📅 Interview scheduling
* ☁️ Cloud deployment
* 🔍 Advanced admin search and filtering

---


# 📄 License

This project is licensed under the **MIT License**.

---

## ❤️ Built With

Built with **React, Node.js, Express, MongoDB, and Tailwind CSS** to simplify and modernize the campus placement management process.

⭐ If you find this project useful, consider giving the repository a star!
