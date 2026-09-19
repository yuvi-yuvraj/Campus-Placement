import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { HiOutlineOfficeBuilding, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await studentAPI.getApplications();
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredApplications = filter === 'All' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const statusCounts = {
    All: applications.length,
    Pending: applications.filter(app => app.status === 'Pending').length,
    Approved: applications.filter(app => app.status === 'Approved').length,
    Rejected: applications.filter(app => app.status === 'Rejected').length
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
        <p className="text-slate-400">Track the status of your job applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? status === 'Approved' ? 'bg-emerald-600 text-white' :
                  status === 'Rejected' ? 'bg-red-600 text-white' :
                  status === 'Pending' ? 'bg-yellow-600 text-white' :
                  'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application._id} className="glass-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    application.status === 'Approved' ? 'bg-emerald-500/20' :
                    application.status === 'Rejected' ? 'bg-red-500/20' :
                    'bg-yellow-500/20'
                  }`}>
                    {application.status === 'Approved' ? (
                      <HiOutlineCheckCircle className="text-2xl text-emerald-400" />
                    ) : application.status === 'Rejected' ? (
                      <HiOutlineXCircle className="text-2xl text-red-400" />
                    ) : (
                      <HiOutlineClock className="text-2xl text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {application.jobId?.title || 'Job Title'}
                    </h3>
                    <div className="flex items-center text-slate-400 text-sm mb-2">
                      <HiOutlineOfficeBuilding className="mr-1" />
                      <span>{application.jobId?.company || 'Company'}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                      <span>Applied: {formatDate(application.appliedAt)}</span>
                      {application.jobId?.package && (
                        <span>Package: {application.jobId.package}</span>
                      )}
                    </div>
                    {application.remarks && (
                      <p className="mt-2 text-sm text-slate-300 bg-slate-700/30 p-2 rounded">
                        <span className="text-slate-500">Remarks: </span>{application.remarks}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`badge ${
                  application.status === 'Approved' ? 'badge-approved' :
                  application.status === 'Rejected' ? 'badge-rejected' :
                  'badge-pending'
                }`}>
                  {application.status}
                </span>
                <Link 
                  to={`/student/job/${application.jobId?._id}`}
                  className="btn-secondary text-sm py-2"
                >
                  View Job
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {filter === 'All' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
          </h3>
          <p className="text-slate-400 mb-4">
            {filter === 'All' 
              ? 'Start applying to jobs to see your applications here'
              : 'Try changing the filter to see other applications'}
          </p>
          {filter === 'All' && (
            <Link to="/student/jobs" className="btn-primary">
              Browse Jobs
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;
