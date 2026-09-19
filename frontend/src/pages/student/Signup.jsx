import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dept: 'CSE',
    year: 2025,
    cgpa: '',
    backlogs: 0 
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIML', 'DS', 'Other'];
  const years = [2024, 2025, 2026, 2027, 2028];

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.cgpa < 0 || formData.cgpa > 10) {
      toast.error('CGPA must be between 0 and 10');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await authAPI.studentRegister(submitData);
      const { token, refreshToken, user } = response.data;
      
      await login(user, token, refreshToken);
      toast.success('Registration successful!');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CP</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join the campus placement portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@student.edu"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter password"
                minLength={6}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm password"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="9876543210"
              />
            </div>

            {/* Department */}
            <div>
              <label className="input-label">Department</label>
              <select
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                className="input-field appearance-none cursor-pointer"
                required
              >
                {departments.map(dept => (
                  <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                ))}
              </select>
            </div>

            {/* Passout Year */}
            <div>
              <label className="input-label">Passout Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input-field appearance-none cursor-pointer"
                required
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
                value={formData.cgpa}
                onChange={handleChange}
                className="input-field"
                placeholder="8.5"
                step="0.01"
                min="0"
                max="10"
                required
              />
            </div>

            {/* Backlogs */}
            <div className="md:col-span-2">
              <label className="input-label">Number of Backlogs</label>
              <input
                type="number"
                name="backlogs"
                value={formData.backlogs}
                onChange={handleChange}
                className="input-field"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

