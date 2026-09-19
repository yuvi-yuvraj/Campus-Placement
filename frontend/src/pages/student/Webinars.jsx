import { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUser, HiOutlineExternalLink, HiOutlineDesktopComputer } from 'react-icons/hi';

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const response = await studentAPI.getWebinars();
      setWebinars(response.data.data);
    } catch (error) {
      console.error('Error fetching webinars:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isPast = (dateString) => {
    return new Date(dateString) < new Date();
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
        <h1 className="text-3xl font-bold text-white mb-2">Webinars & Events</h1>
        <p className="text-slate-400">Learn from industry experts and prepare for placements</p>
      </div>

      {/* Webinars Grid */}
      <div className="card-grid">
        {webinars.map((webinar) => (
          <div key={webinar._id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isPast(webinar.date)
                  ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {isPast(webinar.date) ? 'Completed' : 'Upcoming'}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{webinar.title}</h3>
            
            <div className="flex items-center text-slate-400 text-sm mb-4">
              <HiOutlineUser className="mr-2 text-amber-400" />
              <span>{webinar.speaker}</span>
            </div>

            {webinar.description && (
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{webinar.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-300">
                <HiOutlineCalendar className="mr-2 text-amber-400" />
                <span>{formatDate(webinar.date)}</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <HiOutlineClock className="mr-2 text-amber-400" />
                <span>{webinar.time}</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <HiOutlineDesktopComputer className="mr-2 text-amber-400" />
                <span>{webinar.platform || 'Online'}</span>
              </div>
            </div>

            {webinar.link && !isPast(webinar.date) && (
              <a 
                href={webinar.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-2 bg-amber-600/30 text-amber-300 rounded-lg text-sm font-medium
                         hover:bg-amber-600/50 transition-all duration-200"
              >
                Join Webinar <HiOutlineExternalLink className="ml-2" />
              </a>
            )}
          </div>
        ))}
      </div>

      {webinars.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold text-white mb-2">No webinars scheduled</h3>
          <p className="text-slate-400">Check back later for upcoming events</p>
        </div>
      )}
    </div>
  );
};

export default Webinars;
