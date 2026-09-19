import { Link } from 'react-router-dom';
import { HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

const JobCard = ({ job, showApply = true }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
          <div className="flex items-center text-slate-400 text-sm">
            <HiOutlineOfficeBuilding className="mr-1" />
            <span>{job.company}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          job.isActive 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
        }`}>
          {job.isActive ? 'Active' : 'Closed'}
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-slate-300">
          <HiOutlineCurrencyRupee className="mr-2 text-indigo-400" />
          <span>{job.package}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <HiOutlineLocationMarker className="mr-2 text-indigo-400" />
          <span>{job.location || 'On-site'}</span>
        </div>
      </div>

      {/* Criteria Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.criteria?.minCGPA > 0 && (
          <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
            CGPA ≥ {job.criteria.minCGPA}
          </span>
        )}
        {!job.criteria?.allowBacklogs && (
          <span className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-400">
            No Backlogs
          </span>
        )}
        {job.criteria?.departmentList?.length > 0 && (
          <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
            {job.criteria.departmentList.join(', ')}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center text-xs text-slate-500">
          <HiOutlineClock className="mr-1" />
          <span>Posted {formatDate(job.postedAt)}</span>
        </div>
        {showApply && (
          <Link 
            to={`/student/job/${job._id}`}
            className="px-4 py-2 bg-indigo-600/30 text-indigo-300 rounded-lg text-sm font-medium
                     hover:bg-indigo-600/50 transition-all duration-200"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
