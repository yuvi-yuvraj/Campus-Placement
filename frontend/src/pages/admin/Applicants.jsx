import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineMail, HiOutlinePhone, HiOutlineLink } from 'react-icons/hi';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const response = await adminAPI.getJobApplicants(jobId);
      setApplicants(response.data.data);
      if (response.data.data.length > 0) {
        setJobInfo(response.data.data[0].jobId);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    setUpdating(applicationId);
    try {
      await adminAPI.approveApplication(applicationId, 'Congratulations! Your application has been approved.');
      toast.success('Application approved');
      setApplicants(applicants.map(app => 
        app._id === applicationId ? { ...app, status: 'Approved' } : app
      ));
    } catch (error) {
      toast.error('Failed to approve');
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (applicationId) => {
    setUpdating(applicationId);
    try {
      await adminAPI.rejectApplication(applicationId, 'We regret to inform you that your application was not selected.');
      toast.success('Application rejected');
      setApplicants(applicants.map(app => 
        app._id === applicationId ? { ...app, status: 'Rejected' } : app
      ));
    } catch (error) {
      toast.error('Failed to reject');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/admin/jobs')}
          className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <HiArrowLeft className="mr-2" /> Back to Jobs
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">
          Applicants {jobInfo && `- ${jobInfo.title}`}
        </h1>
        <p className="text-slate-400">
          {jobInfo && `${jobInfo.company} • ${applicants.length} applications`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {applicants.filter(a => a.status === 'Pending').length}
          </div>
          <div className="text-sm text-slate-400">Pending</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {applicants.filter(a => a.status === 'Approved').length}
          </div>
          <div className="text-sm text-slate-400">Approved</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {applicants.filter(a => a.status === 'Rejected').length}
          </div>
          <div className="text-sm text-slate-400">Rejected</div>
        </div>
      </div>

      {/* Applicants List */}
      <div className="space-y-4">
        {applicants.map((application) => (
          <div key={application._id} className="glass-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Student Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {application.studentId?.name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {application.studentId?.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-2">
                      <span className="flex items-center">
                        <HiOutlineMail className="mr-1" />
                        {application.studentId?.email}
                      </span>
                      {application.studentId?.phone && (
                        <span className="flex items-center">
                          <HiOutlinePhone className="mr-1" />
                          {application.studentId?.phone}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                        {application.studentId?.dept}
                      </span>
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                        Batch {application.studentId?.year}
                      </span>
                      <span className="px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-400">
                        CGPA: {application.studentId?.cgpa}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        application.studentId?.backlogs > 0 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {application.studentId?.backlogs || 0} Backlogs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {application.studentId?.skills?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-sm text-slate-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {application.studentId.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700/30 rounded text-xs text-slate-400">
                          {skill}
                        </span>
                      ))}
                      {application.studentId.skills.length > 5 && (
                        <span className="px-2 py-1 text-xs text-slate-500">
                          +{application.studentId.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Resume Link */}
                {application.studentId?.resumeLink && (
                  <div className="mt-3">
                    <a 
                      href={application.studentId.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      <HiOutlineLink className="mr-1" /> View Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-4">
                <div className="text-right">
                  <span className={`badge ${
                    application.status === 'Approved' ? 'badge-approved' :
                    application.status === 'Rejected' ? 'badge-rejected' :
                    'badge-pending'
                  }`}>
                    {application.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Applied: {formatDate(application.appliedAt)}
                  </p>
                </div>

                {application.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(application._id)}
                      disabled={updating === application._id}
                      className="flex items-center px-4 py-2 bg-emerald-600/30 text-emerald-400 rounded-lg text-sm font-medium
                               hover:bg-emerald-600/50 transition-all disabled:opacity-50"
                    >
                      <HiOutlineCheckCircle className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(application._id)}
                      disabled={updating === application._id}
                      className="flex items-center px-4 py-2 bg-red-600/30 text-red-400 rounded-lg text-sm font-medium
                               hover:bg-red-600/50 transition-all disabled:opacity-50"
                    >
                      <HiOutlineXCircle className="mr-1" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {applicants.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
          <p className="text-slate-400">Students will appear here when they apply</p>
        </div>
      )}
    </div>
  );
};

export default Applicants;
