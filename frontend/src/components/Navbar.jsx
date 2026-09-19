import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/jobs', label: 'Jobs' },
    { to: '/student/internships', label: 'Internships' },
    { to: '/student/webinars', label: 'Webinars' },
    { to: '/student/applications', label: 'My Applications' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/jobs', label: 'Manage Jobs' },
    { to: '/admin/internships', label: 'Internships' },
    { to: '/admin/webinars', label: 'Webinars' },
  ];

  const links = isAdmin ? adminLinks : isStudent ? studentLinks : [];

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/'} 
                className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">CP</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">Campus Placement</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === link.to 
                    ? 'bg-indigo-600/30 text-indigo-300' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? '/admin/dashboard' : '/student/profile'} 
                      className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{user?.name || 'User'}</span>
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2">
                  Student Login
                </Link>
                <Link to="/admin/login" className="btn-primary text-sm py-2">
                  Admin Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50">
            <div className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === link.to 
                      ? 'bg-indigo-600/30 text-indigo-300' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link 
                    to={isAdmin ? '/admin/dashboard' : '/student/profile'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary text-sm py-2 mt-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary text-sm py-2 text-center">
                    Student Login
                  </Link>
                  <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-sm py-2 text-center">
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
