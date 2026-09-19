import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Landing
import Landing from './pages/Landing';

// Student Pages
import StudentLogin from './pages/student/Login';
import StudentSignup from './pages/student/Signup';
import StudentDashboard from './pages/student/Dashboard';
import StudentJobs from './pages/student/Jobs';
import JobDetails from './pages/student/JobDetails';
import StudentInternships from './pages/student/Internships';
import StudentWebinars from './pages/student/Webinars';
import StudentApplications from './pages/student/Applications';
import StudentProfile from './pages/student/Profile';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import CreateJob from './pages/admin/CreateJob';
import ManageJobs from './pages/admin/ManageJobs';
import ManageInternships from './pages/admin/ManageInternships';
import ManageWebinars from './pages/admin/ManageWebinars';
import Applicants from './pages/admin/Applicants';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/signup" element={<StudentSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student Protected Routes */}
          <Route path="/student" element={<ProtectedRoute role="student" />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="jobs" element={<StudentJobs />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="internships" element={<StudentInternships />} />
            <Route path="webinars" element={<StudentWebinars />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs" element={<ManageJobs />} />
            <Route path="jobs/edit/:id" element={<CreateJob />} />
            <Route path="internships" element={<ManageInternships />} />
            <Route path="webinars" element={<ManageWebinars />} />
            <Route path="applicants/:jobId" element={<Applicants />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
