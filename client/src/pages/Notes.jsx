import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { formatDistanceToNow } from 'date-fns';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Fetching notes for user:', user.uid);

        const q = query(
          collection(db, 'notes'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        console.log('Query executed, documents found:', querySnapshot.size);
        
        const notesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNotes(notesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notes:', err);
        
        // Enhanced error messages
        let errorMessage = 'Failed to load notes. ';
        if (err.code === 'permission-denied') {
          errorMessage += 'Access denied. Please check Firestore rules in Firebase console. Make sure they allow reading documents where userId matches your user ID.';
        } else if (err.code === 'unavailable') {
          errorMessage += 'Firebase service is currently unavailable. Please try again later.';
        } else if (err.code === 'unauthenticated') {
          errorMessage += 'Authentication required. Please log in again.';
          // Force redirect to login if unauthenticated
          setTimeout(() => navigate('/login'), 2000);
        } else {
          errorMessage += err.message || 'Unknown error.';
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      
      // Get a fresh reference to the auth user
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to delete notes');
        setDeletingId(null);
        return;
      }
      
      await deleteDoc(doc(db, 'notes', id));
      
      // Animate removal and update state after animation
      setTimeout(() => {
        setNotes(notes.filter(note => note.id !== id));
        setDeletingId(null);
      }, 300);
    } catch (err) {
      console.error('Error deleting note:', err);
      
      // Enhanced error messages for delete operation
      let errorMessage = 'Failed to delete note. ';
      if (err.code === 'permission-denied') {
        errorMessage += 'You do not have permission to delete this note.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      setError(errorMessage);
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    try {
      const date = timestamp.toDate();
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="notes-header">
          <h1>My Notes</h1>
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="notes-header">
          <h1>My Notes</h1>
        </div>
        <div className="error-message">{error}</div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="btn btn-secondary">Go Home</Link>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="container">
        <div className="notes-header">
          <h1>My Notes</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No Notes Found</h3>
          <p>You haven't created any notes yet. Get started by creating your first note.</p>
          <Link to="/create" className="btn btn-primary create-btn">Create Note</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="notes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Notes</h1>
        <Link to="/create" className="btn btn-primary create-btn">Create Note</Link>
      </div>
      
      {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}
      
      <div className="note-grid">
        {notes.map(note => (
          <div 
            key={note.id} 
            className={`note-card ${deletingId === note.id ? 'deleting' : ''}`}
          >
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            <div className="note-date">Created {formatDate(note.createdAt)}</div>
            
            <div className="note-actions">
              <Link to={`/edit/${note.id}`} className="btn btn-secondary">Edit</Link>
              <button 
                onClick={() => handleDelete(note.id)} 
                className="btn delete-btn"
                disabled={deletingId === note.id}
              >
                {deletingId === note.id ? (
                  <><span className="spinner-dots"></span>Deleting...</>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes; 