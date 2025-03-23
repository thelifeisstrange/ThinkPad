import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const authContext = useAuth();
  const currentUser = authContext?.currentUser;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
  
  const isLoggedIn = currentUser !== null && currentUser !== undefined;
  
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
                <Link to="#" onClick={handleLogout} className="nav-link">Logout</Link>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${currentPath === '/login' ? 'active' : ''}`}>Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 