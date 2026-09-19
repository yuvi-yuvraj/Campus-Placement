import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineOfficeBuilding, HiOutlinePencil, HiOutlineTrash, HiPlus, HiX } from 'react-icons/hi';

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    link: '',
    description: '',
    duration: '',
    stipend: '',
    location: 'Remote',
    isActive: true
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await adminAPI.getAllInternships();
      setInternships(response.data.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const openModal = (internship = null) => {
    if (internship) {
      setEditingId(internship._id);
      setFormData(internship);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        company: '',
        link: '',
        description: '',
        duration: '',
        stipend: '',
        location: 'Remote',
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
        await adminAPI.updateInternship(editingId, formData);
        toast.success('Internship updated successfully');
      } else {
        await adminAPI.createInternship(formData);
        toast.success('Internship created successfully');
      }
      fetchInternships();
      closeModal();
    } catch (error) {
      toast.error('Failed to save internship');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      await adminAPI.deleteInternship(id);
      setInternships(internships.filter(i => i._id !== id));
      toast.success('Internship deleted');
    } catch (error) {
      toast.error('Failed to delete');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Internships</h1>
          <p className="text-slate-400">Add and manage internship opportunities</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center">
          <HiPlus className="mr-2" /> Add Internship
        </button>
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
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-500/20 text-slate-400'
              }`}>
                {internship.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{internship.description}</p>

            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="text-slate-300">
                <span className="text-slate-500">Duration: </span>{internship.duration || 'N/A'}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500">Stipend: </span>{internship.stipend || 'N/A'}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-700/50">
              <button
                onClick={() => openModal(internship)}
                className="flex-1 py-2 text-sm text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
              >
                <HiOutlinePencil className="inline mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(internship._id)}
                className="flex-1 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
              >
                <HiOutlineTrash className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {internships.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-white mb-2">No internships yet</h3>
          <p className="text-slate-400 mb-4">Add your first internship opportunity</p>
          <button onClick={() => openModal()} className="btn-primary">
            Add Internship
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit Internship' : 'Add Internship'}
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
                <label className="input-label">Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="2 months"
                  />
                </div>
                <div>
                  <label className="input-label">Stipend</label>
                  <input
                    type="text"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="₹15,000/month"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Application Link</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                  required
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

export default ManageInternships;
