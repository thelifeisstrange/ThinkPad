import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteRef = doc(db, 'notes', id);
        const noteSnap = await getDoc(noteRef);
        
        if (!noteSnap.exists()) {
          setError('Note not found');
          setLoading(false);
          return;
        }
        
        const noteData = noteSnap.data();
        
        // Verify ownership
        const user = auth.currentUser;
        if (!user || noteData.userId !== user.uid) {
          setError('You do not have permission to edit this note');
          setLoading(false);
          return;
        }
        
        setTitle(noteData.title);
        setContent(noteData.content);
        setLoading(false);
      } catch (err) {
        console.error('Error loading note:', err);
        setError('Failed to load note: ' + (err.message || 'Unknown error'));
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to edit notes');
        setIsSaving(false);
        return;
      }
      
      const noteRef = doc(db, 'notes', id);
      
      await updateDoc(noteRef, {
        title,
        content,
        updatedAt: serverTimestamp()
      });
      
      // Success animation before redirect
      setTimeout(() => {
        navigate('/notes');
      }, 500);
      
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note: ' + (err.message || 'Unknown error'));
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Edit Note</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Edit Note</h1>
      
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
              disabled={isSaving}
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
              disabled={isSaving}
            />
          </div>
          
          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/notes')}
              disabled={isSaving}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <><span className="spinner-dots"></span>Saving...</>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNote; 