import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import JobCard from '../../components/JobCard';
import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineVideoCamera, HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Jobs', value: dashboardData?.totalJobs || 0, icon: HiOutlineBriefcase, color: 'indigo' },
    { label: 'Internships', value: dashboardData?.totalInternships || 0, icon: HiOutlineAcademicCap, color: 'emerald' },
    { label: 'Webinars', value: dashboardData?.totalWebinars || 0, icon: HiOutlineVideoCamera, color: 'amber' },
    { label: 'My Applications', value: dashboardData?.myApplications || 0, icon: HiOutlineDocumentText, color: 'purple' },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-slate-400">Here's what's happening with your placement journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-6">
            <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`text-2xl text-${stat.color}-400`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Application Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <HiOutlineClock className="text-2xl text-yellow-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{dashboardData?.pendingApplications || 0}</div>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <HiOutlineCheckCircle className="text-2xl text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{dashboardData?.approvedApplications || 0}</div>
            <div className="text-sm text-slate-400">Approved</div>
          </div>
        </div>
        <div className="glass-card p-6">
          <Link to="/student/applications" className="btn-secondary w-full text-center block">
            View All Applications
          </Link>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Job Postings</h2>
          <Link to="/student/jobs" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="card-grid">
          {dashboardData?.recentJobs?.slice(0, 3).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          {(!dashboardData?.recentJobs || dashboardData.recentJobs.length === 0) && (
            <div className="col-span-full text-center py-12 text-slate-400">
              No job postings available yet.
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/student/jobs" className="glass-card p-6 text-center hover:bg-indigo-600/20 transition-all">
          <HiOutlineBriefcase className="text-3xl text-indigo-400 mx-auto mb-2" />
          <span className="text-white font-medium">Browse Jobs</span>
        </Link>
        <Link to="/student/internships" className="glass-card p-6 text-center hover:bg-emerald-600/20 transition-all">
          <HiOutlineAcademicCap className="text-3xl text-emerald-400 mx-auto mb-2" />
          <span className="text-white font-medium">Internships</span>
        </Link>
        <Link to="/student/webinars" className="glass-card p-6 text-center hover:bg-amber-600/20 transition-all">
          <HiOutlineVideoCamera className="text-3xl text-amber-400 mx-auto mb-2" />
          <span className="text-white font-medium">Webinars</span>
        </Link>
        <Link to="/student/profile" className="glass-card p-6 text-center hover:bg-purple-600/20 transition-all">
          <HiOutlineDocumentText className="text-3xl text-purple-400 mx-auto mb-2" />
          <span className="text-white font-medium">My Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
