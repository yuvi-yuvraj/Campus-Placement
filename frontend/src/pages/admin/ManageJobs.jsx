import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineOfficeBuilding, HiOutlinePencil, HiOutlineTrash, HiOutlineUsers, HiPlus } from 'react-icons/hi';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await adminAPI.getAllJobs();
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job? This will also delete all applications.')) return;
    
    setDeleting(jobId);
    try {
      await adminAPI.deleteJob(jobId);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Jobs</h1>
          <p className="text-slate-400">View and manage all job postings</p>
        </div>
        <Link to="/admin/jobs/create" className="btn-primary flex items-center">
          <HiPlus className="mr-2" /> Create Job
        </Link>
      </div>

      {/* Jobs Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-700/30">
                <th className="px-6 py-4 text-slate-400 font-medium">Job</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Package</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Status</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Posted</th>
                <th className="px-6 py-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {jobs.map((job) => (
                <tr key={job._id} className="text-slate-300 hover:bg-slate-700/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <HiOutlineOfficeBuilding className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{job.title}</div>
                        <div className="text-sm text-slate-500">{job.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{job.package}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.isActive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{formatDate(job.postedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/admin/applicants/${job._id}`}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all"
                        title="View Applicants"
                      >
                        <HiOutlineUsers />
                      </Link>
                      <Link 
                        to={`/admin/jobs/edit/${job._id}`}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
                        title="Edit"
                      >
                        <HiOutlinePencil />
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deleting === job._id}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-white mb-2">No jobs created yet</h3>
          <p className="text-slate-400 mb-4">Create your first job posting</p>
          <Link to="/admin/jobs/create" className="btn-primary">
            Create Job
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
