import { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import JobCard from '../../components/JobCard';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const departments = ['All', 'CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIML', 'DS'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, departmentFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await studentAPI.getJobs();
      setJobs(response.data.data);
      setFilteredJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let result = jobs;

    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter && departmentFilter !== 'All') {
      result = result.filter(job => 
        !job.criteria.departmentList.length || 
        job.criteria.departmentList.includes(departmentFilter)
      );
    }

    setFilteredJobs(result);
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
        <h1 className="text-3xl font-bold text-white mb-2">Job Postings</h1>
        <p className="text-slate-400">Explore opportunities from top companies</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11"
              placeholder="Search by job title or company..."
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <HiOutlineFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input-field pl-11 pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-slate-400">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>

      {/* Jobs Grid */}
      <div className="card-grid">
        {filteredJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
          <p className="text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
