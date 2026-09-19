import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineCalendar, HiOutlinePencil, HiOutlineTrash, HiPlus, HiX } from 'react-icons/hi';

const ManageWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: '',
    time: '',
    link: '',
    description: '',
    platform: 'Zoom',
    isActive: true
  });

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const response = await adminAPI.getAllWebinars();
      setWebinars(response.data.data);
    } catch (error) {
      console.error('Error fetching webinars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const openModal = (webinar = null) => {
    if (webinar) {
      setEditingId(webinar._id);
      setFormData({
        ...webinar,
        date: webinar.date ? webinar.date.split('T')[0] : ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        speaker: '',
        date: '',
        time: '',
        link: '',
        description: '',
        platform: 'Zoom',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await adminAPI.updateWebinar(editingId, formData);
        toast.success('Webinar updated successfully');
      } else {
        await adminAPI.createWebinar(formData);
        toast.success('Webinar created successfully');
      }
      fetchWebinars();
      closeModal();
    } catch (error) {
      toast.error('Failed to save webinar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this webinar?')) return;

    try {
      await adminAPI.deleteWebinar(id);
      setWebinars(webinars.filter(w => w._id !== id));
      toast.success('Webinar deleted');
    } catch (error) {
      toast.error('Failed to delete');
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
          <h1 className="text-3xl font-bold text-white mb-2">Manage Webinars</h1>
          <p className="text-slate-400">Schedule and manage webinars and events</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center">
          <HiPlus className="mr-2" /> Add Webinar
        </button>
      </div>

      {/* Webinars Grid */}
      <div className="card-grid">
        {webinars.map((webinar) => (
          <div key={webinar._id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                webinar.isActive 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : 'bg-slate-500/20 text-slate-400'
              }`}>
                {webinar.isActive ? 'Scheduled' : 'Inactive'}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{webinar.title}</h3>
            <p className="text-slate-400 text-sm mb-2">Speaker: {webinar.speaker}</p>

            <div className="flex items-center text-sm text-slate-300 mb-2">
              <HiOutlineCalendar className="mr-2 text-amber-400" />
              <span>{formatDate(webinar.date)} at {webinar.time}</span>
            </div>

            <p className="text-slate-500 text-sm mb-4">Platform: {webinar.platform}</p>

            <div className="flex gap-2 pt-4 border-t border-slate-700/50">
              <button
                onClick={() => openModal(webinar)}
                className="flex-1 py-2 text-sm text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
              >
                <HiOutlinePencil className="inline mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(webinar._id)}
                className="flex-1 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
              >
                <HiOutlineTrash className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {webinars.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold text-white mb-2">No webinars scheduled</h3>
          <p className="text-slate-400 mb-4">Create your first webinar</p>
          <button onClick={() => openModal()} className="btn-primary">
            Add Webinar
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit Webinar' : 'Add Webinar'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <HiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="input-label">Speaker *</label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Time *</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="6:00 PM IST"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Zoom" className="bg-slate-800">Zoom</option>
                  <option value="Google Meet" className="bg-slate-800">Google Meet</option>
                  <option value="Microsoft Teams" className="bg-slate-800">Microsoft Teams</option>
                  <option value="Other" className="bg-slate-800">Other</option>
                </select>
              </div>
              <div>
                <label className="input-label">Meeting Link</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                />
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-500"
                />
                <span className="ml-3 text-white">Active</span>
              </label>
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={saving} className="btn-success flex-1">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWebinars;
