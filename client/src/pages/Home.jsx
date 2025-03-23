import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome to ThinkPad Notes App
          </h1>
          
          <p className="hero-description">
            A beautiful and simple way to create, organize and manage your notes. 
            Store your ideas, thoughts and memories securely in the cloud.
          </p>
          
          {user ? (
            <div className="hero-buttons">
              <Link to="/notes" className="btn btn-primary">
                My Notes
              </Link>
              <Link to="/create" className="btn btn-primary">
                Create Note
              </Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
        
        {!user && (
          <div className="features-section">
            <div className="feature-card card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">User Authentication</h3>
              <p>Secure login and registration system keeps your notes private and accessible only to you.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Note Management</h3>
              <p>Create, edit, and delete notes with a user-friendly interface. Organize your thoughts efficiently.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">☁️</div>
              <h3 className="feature-title">Cloud Storage</h3>
              <p>Your notes are securely stored, allowing you to access them from anywhere at any time.</p>
            </div>
          </div>
        )}
      </div>
      
      <footer className="footer">
        <p>© {new Date().getFullYear()} ThinkPad Notes App. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home; 