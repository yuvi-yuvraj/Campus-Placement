import { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineExternalLink } from 'react-icons/hi';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await studentAPI.getInternships();
      setInternships(response.data.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
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

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Internship Opportunities</h1>
        <p className="text-slate-400">Gain practical experience with top companies</p>
      </div>

      {/* Internships Grid */}
      <div className="card-grid">
        {internships.map((internship) => (
          <div key={internship._id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{internship.title}</h3>
                <div className="flex items-center text-slate-400 text-sm">
                  <HiOutlineOfficeBuilding className="mr-1" />
                  <span>{internship.company}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                internship.isActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}>
                {internship.isActive ? 'Open' : 'Closed'}
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{internship.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-sm text-slate-300">
                <HiOutlineClock className="mr-2 text-emerald-400" />
                <span>{internship.duration || 'Flexible'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <HiOutlineLocationMarker className="mr-2 text-emerald-400" />
                <span>{internship.location || 'Remote'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-300 col-span-2">
                <HiOutlineCurrencyRupee className="mr-2 text-emerald-400" />
                <span>{internship.stipend || 'Stipend available'}</span>
              </div>
            </div>

            {internship.link && (
              <a 
                href={internship.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-2 bg-emerald-600/30 text-emerald-300 rounded-lg text-sm font-medium
                         hover:bg-emerald-600/50 transition-all duration-200"
              >
                Apply Now <HiOutlineExternalLink className="ml-2" />
              </a>
            )}
          </div>
        ))}
      </div>

      {internships.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-white mb-2">No internships available</h3>
          <p className="text-slate-400">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
};

export default Internships;
