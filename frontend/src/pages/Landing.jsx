import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineVideoCamera, HiArrowRight } from 'react-icons/hi';

const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="page-container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
          <Link 
            to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} 
            className="btn-primary inline-flex items-center"
          >
            Go to Dashboard <HiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-container py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-6">
            🎓 Campus Placement Portal
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Gateway to <br />
            <span className="gradient-text">Dream Career</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Connect with top companies, explore internship opportunities, and take the first step towards your professional journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary flex items-center">
              Get Started <HiArrowRight className="ml-2" />
            </Link>
            <Link to="/login" className="btn-secondary">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="page-container py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Access job postings, internships, and events all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Job Postings */}
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiOutlineBriefcase className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Job Postings</h3>
            <p className="text-slate-400">
              Browse through curated job opportunities from top companies and apply with a single click.
            </p>
          </div>

          {/* Internships */}
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiOutlineAcademicCap className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Internships</h3>
            <p className="text-slate-400">
              Gain real-world experience with internship opportunities from industry leaders.
            </p>
          </div>

          {/* Webinars */}
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiOutlineVideoCamera className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Webinars & Events</h3>
            <p className="text-slate-400">
              Attend expert sessions, workshops, and placement preparation webinars.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="page-container py-20">
        <div className="glass-card p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">50+</div>
              <div className="text-slate-400">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">200+</div>
              <div className="text-slate-400">Job Openings</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">1000+</div>
              <div className="text-slate-400">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-slate-400">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-container py-20">
        <div className="glass-card p-12 text-center bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join thousands of students who have found their dream careers through our portal.
          </p>
          <Link to="/signup" className="btn-primary inline-flex items-center">
            Create Account <HiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
