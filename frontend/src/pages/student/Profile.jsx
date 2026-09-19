import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineAcademicCap, HiOutlineLink, HiOutlinePencil } from 'react-icons/hi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIML', 'DS', 'Other'];
  const years = [2024, 2025, 2026, 2027, 2028];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      setProfile(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, skills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await studentAPI.updateProfile(formData);
      setProfile(response.data.data);
      updateUser(response.data.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">Manage your personal information</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center">
            <HiOutlinePencil className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="glass-card p-8">
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700/50">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">
              {profile?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{profile?.name}</h2>
            <p className="text-slate-400">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                {profile?.dept}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                Batch of {profile?.year}
              </span>
            </div>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Department */}
              <div>
                <label className="input-label">Department</label>
                <select
                  name="dept"
                  value={formData.dept || ''}
                  onChange={handleChange}
                  className="input-field"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="input-label">Passout Year</label>
                <select
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className="input-field"
                >
                  {years.map(year => (
                    <option key={year} value={year} className="bg-slate-800">{year}</option>
                  ))}
                </select>
              </div>

              {/* CGPA */}
              <div>
                <label className="input-label">CGPA</label>
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa || ''}
                  onChange={handleChange}
                  className="input-field"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                />
              </div>

              {/* Backlogs */}
              <div>
                <label className="input-label">Number of Backlogs</label>
                <input
                  type="number"
                  name="backlogs"
                  value={formData.backlogs || 0}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                />
              </div>

              {/* Resume Link */}
              <div className="md:col-span-2">
                <label className="input-label">Resume Link (Google Drive, Dropbox, etc.)</label>
                <input
                  type="url"
                  name="resumeLink"
                  value={formData.resumeLink || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label className="input-label">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills?.join(', ') || ''}
                  onChange={handleSkillsChange}
                  className="input-field"
                  placeholder="JavaScript, React, Node.js, Python..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={saving} className="btn-success">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HiOutlineUser className="text-indigo-400 text-xl" />
                <div>
                  <p className="text-slate-500 text-sm">Full Name</p>
                  <p className="text-white">{profile?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineMail className="text-indigo-400 text-xl" />
                <div>
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="text-white">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="text-indigo-400 text-xl" />
                <div>
                  <p className="text-slate-500 text-sm">Phone</p>
                  <p className="text-white">{profile?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HiOutlineAcademicCap className="text-indigo-400 text-xl" />
                <div>
                  <p className="text-slate-500 text-sm">CGPA</p>
                  <p className="text-white">{profile?.cgpa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineAcademicCap className="text-indigo-400 text-xl" />
                <div>
                  <p className="text-slate-500 text-sm">Backlogs</p>
                  <p className="text-white">{profile?.backlogs || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineLink className="text-indigo-400 text-xl" />
                <div>
                  <p className="text-slate-500 text-sm">Resume</p>
                  {profile?.resumeLink ? (
                    <a href={profile.resumeLink} target="_blank" rel="noopener noreferrer" 
                       className="text-indigo-400 hover:text-indigo-300">
                      View Resume
                    </a>
                  ) : (
                    <p className="text-white">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {profile?.skills?.length > 0 && (
              <div className="md:col-span-2 pt-4 border-t border-slate-700/50">
                <p className="text-slate-500 text-sm mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
