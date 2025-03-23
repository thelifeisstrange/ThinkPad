import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleKeyDown = (e) => {
      // Show diagnostics when Shift+D is pressed
      if (e.key === 'D' && e.shiftKey) {
        setShowDiagnostics(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  
  const isLoggedIn = auth.currentUser !== null;
  
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">ThinkPad Notes</Link>
          
          <div className="hamburger-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {isLoggedIn ? (
              <>
                <Link to="/notes" className={`nav-link ${currentPath === '/notes' ? 'active' : ''}`}>Notes</Link>
                <Link to="/create" className={`nav-link ${currentPath === '/create' ? 'active' : ''}`}>Create</Link>
                {showDiagnostics && (
                  <Link to="/diagnostics" className={`nav-link ${currentPath === '/diagnostics' ? 'active' : ''}`}>Diagnostics</Link>
                )}
                <Link to="#" onClick={handleLogout} className="nav-link">Logout</Link>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${currentPath === '/login' ? 'active' : ''}`}>Login</Link>
                {showDiagnostics && (
                  <Link to="/diagnostics" className={`nav-link ${currentPath === '/diagnostics' ? 'active' : ''}`}>Diagnostics</Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 