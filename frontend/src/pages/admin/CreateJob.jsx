import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiArrowLeft } from 'react-icons/hi';

const CreateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    package: '',
    applicationLink: '',
    location: '',
    jobType: 'Full-time',
    criteria: {
      minCGPA: 0,
      allowBacklogs: true,
      departmentList: [],
      yearList: []
    },
    isActive: true,
    deadline: ''
  });

  const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIML', 'DS'];
  const years = [2024, 2025, 2026, 2027, 2028];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  useEffect(() => {
    if (isEditing) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    setFetchingJob(true);
    try {
      const response = await adminAPI.getAllJobs();
      const job = response.data.data.find(j => j._id === id);
      if (job) {
        setFormData({
          ...job,
          deadline: job.deadline ? job.deadline.split('T')[0] : ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch job details');
    } finally {
      setFetchingJob(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('criteria.')) {
      const criteriaField = name.split('.')[1];
      setFormData({
        ...formData,
        criteria: {
          ...formData.criteria,
          [criteriaField]: type === 'checkbox' ? checked : 
                          type === 'number' ? parseFloat(value) || 0 : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleDepartmentChange = (dept) => {
    const currentList = formData.criteria.departmentList || [];
    const newList = currentList.includes(dept)
      ? currentList.filter(d => d !== dept)
      : [...currentList, dept];
    
    setFormData({
      ...formData,
      criteria: { ...formData.criteria, departmentList: newList }
    });
  };

  const handleYearChange = (year) => {
    const currentList = formData.criteria.yearList || [];
    const newList = currentList.includes(year)
      ? currentList.filter(y => y !== year)
      : [...currentList, year];
    
    setFormData({
      ...formData,
      criteria: { ...formData.criteria, yearList: newList }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await adminAPI.updateJob(id, formData);
        toast.success('Job updated successfully!');
      } else {
        await adminAPI.createJob(formData);
        toast.success('Job created successfully!');
      }
      navigate('/admin/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
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
          {isEditing ? 'Edit Job Posting' : 'Create Job Posting'}
        </h1>
        <p className="text-slate-400">Fill in the details for the job position</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Software Development Engineer"
                required
              />
            </div>
            <div>
              <label className="input-label">Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input-field"
                placeholder="Google"
                required
              />
            </div>
            <div>
              <label className="input-label">Package *</label>
              <input
                type="text"
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="input-field"
                placeholder="15-20 LPA"
                required
              />
            </div>
            <div>
              <label className="input-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Bangalore"
              />
            </div>
            <div>
              <label className="input-label">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="input-field"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type} className="bg-slate-800">{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="input-label">External Application Link (optional)</label>
              <input
                type="url"
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleChange}
                className="input-field"
                placeholder="https://company.com/careers/apply"
              />
            </div>
            <div className="md:col-span-2">
              <label className="input-label">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[150px]"
                placeholder="Describe the role, responsibilities, and requirements..."
                required
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Eligibility Criteria</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label">Minimum CGPA</label>
                <input
                  type="number"
                  name="criteria.minCGPA"
                  value={formData.criteria.minCGPA}
                  onChange={handleChange}
                  className="input-field"
                  step="0.1"
                  min="0"
                  max="10"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="criteria.allowBacklogs"
                    checked={formData.criteria.allowBacklogs}
                    onChange={handleChange}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-white">Allow students with backlogs</span>
                </label>
              </div>
            </div>

            <div>
              <label className="input-label">Eligible Departments (leave empty for all)</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {departments.map(dept => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleDepartmentChange(dept)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.criteria.departmentList?.includes(dept)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label">Eligible Pass-out Years (leave empty for all)</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {years.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearChange(year)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.criteria.yearList?.includes(year)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Job Status</h2>
              <p className="text-slate-400 text-sm mt-1">Set whether this job is accepting applications</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-3 text-white font-medium">Active</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-success">
            {loading ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/jobs')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
