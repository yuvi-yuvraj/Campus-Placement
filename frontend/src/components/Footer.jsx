import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="glass border-t border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <span className="text-xl font-bold gradient-text">Campus Placement</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Connecting talented students with their dream careers. Your gateway to campus placement opportunities, internships, and career guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-slate-400">
                <HiOutlineMail className="text-indigo-400" />
                <span>placement@campus.edu</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <HiOutlinePhone className="text-indigo-400" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <HiOutlineLocationMarker className="text-indigo-400" />
                <span>Placement Cell, Campus</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Campus Placement Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
