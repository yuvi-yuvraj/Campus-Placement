import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCalendar, HiArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await studentAPI.getJob(id);
      setJob(response.data.data);
      setHasApplied(response.data.hasApplied);
      setApplicationStatus(response.data.applicationStatus);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await studentAPI.applyToJob(id);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setApplicationStatus('Pending');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const checkEligibility = () => {
    if (!job || !user) return { eligible: false, reasons: [] };
    
    const reasons = [];
    let eligible = true;

    if (job.criteria?.minCGPA && user.cgpa < job.criteria.minCGPA) {
      eligible = false;
      reasons.push(`CGPA must be ≥ ${job.criteria.minCGPA} (Your CGPA: ${user.cgpa})`);
    }

    if (!job.criteria?.allowBacklogs && user.backlogs > 0) {
      eligible = false;
      reasons.push(`No backlogs allowed (You have: ${user.backlogs})`);
    }

    if (job.criteria?.departmentList?.length > 0 && !job.criteria.departmentList.includes(user.dept)) {
      eligible = false;
      reasons.push(`Only for: ${job.criteria.departmentList.join(', ')} (Your dept: ${user.dept})`);
    }

    if (job.criteria?.yearList?.length > 0 && !job.criteria.yearList.includes(user.year)) {
      eligible = false;
      reasons.push(`Only for passout years: ${job.criteria.yearList.join(', ')} (Your year: ${user.year})`);
    }

    return { eligible, reasons };
  };

  const { eligible, reasons } = checkEligibility();

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-container text-center py-16">
        <h2 className="text-2xl font-bold text-white">Job not found</h2>
        <button onClick={() => navigate('/student/jobs')} className="btn-secondary mt-4">
          Back to Jobs
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/student/jobs')}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <HiArrowLeft className="mr-2" /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="glass-card p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
                <div className="flex items-center text-slate-400">
                  <HiOutlineOfficeBuilding className="mr-2" />
                  <span className="text-lg">{job.company}</span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                job.isActive 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-500/20 text-slate-400'
              }`}>
                {job.isActive ? 'Active' : 'Closed'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center text-slate-300">
                <HiOutlineCurrencyRupee className="mr-2 text-indigo-400" />
                <span>{job.package}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <HiOutlineLocationMarker className="mr-2 text-indigo-400" />
                <span>{job.location || 'On-site'}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <HiOutlineClock className="mr-2 text-indigo-400" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <HiOutlineCalendar className="mr-2 text-indigo-400" />
                <span>Posted {formatDate(job.postedAt)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Job Description</h2>
            <p className="text-slate-300 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Criteria */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Eligibility Criteria</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Minimum CGPA</span>
                <span className="text-white font-medium">{job.criteria?.minCGPA || 'No requirement'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Backlogs Allowed</span>
                <span className={`font-medium ${job.criteria?.allowBacklogs ? 'text-emerald-400' : 'text-red-400'}`}>
                  {job.criteria?.allowBacklogs ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Departments</span>
                <span className="text-white font-medium">
                  {job.criteria?.departmentList?.length > 0 
                    ? job.criteria.departmentList.join(', ') 
                    : 'All departments'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Passout Year</span>
                <span className="text-white font-medium">
                  {job.criteria?.yearList?.length > 0 
                    ? job.criteria.yearList.join(', ') 
                    : 'All years'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <div className="glass-card p-6 sticky top-24">
            {hasApplied ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineCheckCircle className="text-3xl text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Already Applied</h3>
                <p className="text-slate-400 mb-4">
                  Status: <span className={`badge ${
                    applicationStatus === 'Approved' ? 'badge-approved' : 
                    applicationStatus === 'Rejected' ? 'badge-rejected' : 'badge-pending'
                  }`}>{applicationStatus}</span>
                </p>
              </div>
            ) : eligible ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Ready to Apply?</h3>
                <p className="text-slate-400 text-sm mb-6">
                  You meet all the eligibility criteria for this position.
                </p>
                <button 
                  onClick={handleApply}
                  disabled={applying || !job.isActive}
                  className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Applying...
                    </span>
                  ) : (
                    'Apply Now'
                  )}
                </button>
                {!job.isActive && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    This job is no longer accepting applications
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-4">Not Eligible</h3>
                <p className="text-slate-400 text-sm mb-4">
                  You don't meet the following criteria:
                </p>
                <ul className="space-y-2">
                  {reasons.map((reason, index) => (
                    <li key={index} className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* External Link */}
          {job.applicationLink && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">External Application</h3>
              <a 
                href={job.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-center block"
              >
                Visit Company Portal
              </a>
            </div>
          )}

          {/* Deadline */}
          {job.deadline && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Application Deadline</h3>
              <p className="text-xl font-semibold text-white">{formatDate(job.deadline)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
