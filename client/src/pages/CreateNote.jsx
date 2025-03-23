import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication state on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to create notes');
        setIsSubmitting(false);
        return;
      }
      
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add extra log for debugging
      console.log('Creating note with data:', { ...noteData, userId: 'HIDDEN' });
      
      await addDoc(collection(db, 'notes'), noteData);
      
      // Success animation before redirect
      setTimeout(() => {
        navigate('/notes');
      }, 500);
      
    } catch (err) {
      console.error('Error creating note:', err);
      
      // More detailed error handling
      let errorMessage = 'Failed to create note: ';
      if (err.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check Firestore rules.';
      } else if (err.code === 'unavailable') {
        errorMessage += 'Firebase service is currently unavailable. Please try again later.';
      } else if (err.code === 'unauthenticated') {
        errorMessage += 'Authentication required. Please log in again.';
        // Force redirect to login if unauthenticated
        setTimeout(() => navigate('/login'), 2000);
      } else {
        errorMessage += (err.message || 'Unknown error');
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Don't render the form until we confirm authentication
  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>Create New Note</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Create New Note</h1>
      
      <div className="card animate-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content"
              rows="6"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><span className="spinner-dots"></span>Creating...</>
              ) : (
                'Create Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNote; 