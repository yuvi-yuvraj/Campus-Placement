import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineVideoCamera, HiOutlineUsers, HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle, HiPlus } from 'react-icons/hi';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Jobs', value: dashboardData?.totalJobs || 0, icon: HiOutlineBriefcase, color: 'indigo', link: '/admin/jobs' },
    { label: 'Active Jobs', value: dashboardData?.activeJobs || 0, icon: HiOutlineBriefcase, color: 'emerald', link: '/admin/jobs' },
    { label: 'Internships', value: dashboardData?.totalInternships || 0, icon: HiOutlineAcademicCap, color: 'cyan', link: '/admin/internships' },
    { label: 'Webinars', value: dashboardData?.totalWebinars || 0, icon: HiOutlineVideoCamera, color: 'amber', link: '/admin/webinars' },
    { label: 'Total Students', value: dashboardData?.totalStudents || 0, icon: HiOutlineUsers, color: 'purple' },
    { label: 'Total Applications', value: dashboardData?.totalApplications || 0, icon: HiOutlineDocumentText, color: 'pink' },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Overview of placement activities</p>
        </div>
        <Link to="/admin/jobs/create" className="btn-primary flex items-center">
          <HiPlus className="mr-2" /> Create Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link || '#'} className="glass-card p-6 hover:bg-slate-700/30 transition-all">
            <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`text-2xl text-${stat.color}-400`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Application Stats */}
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
        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <HiOutlineXCircle className="text-2xl text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{dashboardData?.rejectedApplications || 0}</div>
            <div className="text-sm text-slate-400">Rejected</div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-700/50">
                <th className="pb-3 text-slate-400 font-medium">Student</th>
                <th className="pb-3 text-slate-400 font-medium">Job</th>
                <th className="pb-3 text-slate-400 font-medium">Status</th>
                <th className="pb-3 text-slate-400 font-medium">Applied</th>
                <th className="pb-3 text-slate-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {dashboardData?.recentApplications?.map((app) => (
                <tr key={app._id} className="text-slate-300">
                  <td className="py-3">
                    <div>
                      <div className="font-medium text-white">{app.studentId?.name}</div>
                      <div className="text-sm text-slate-500">{app.studentId?.email}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <div className="font-medium">{app.jobId?.title}</div>
                      <div className="text-sm text-slate-500">{app.jobId?.company}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`badge ${
                      app.status === 'Approved' ? 'badge-approved' :
                      app.status === 'Rejected' ? 'badge-rejected' :
                      'badge-pending'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm">{formatDate(app.appliedAt)}</td>
                  <td className="py-3">
                    <Link 
                      to={`/admin/applicants/${app.jobId?._id}`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!dashboardData?.recentApplications || dashboardData.recentApplications.length === 0) && (
          <div className="text-center py-8 text-slate-400">
            No recent applications
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
