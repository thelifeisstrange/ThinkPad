import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { checkFirebaseRules, logAuthState } from '../utils/firebaseRulesChecker';

const DiagnosticPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rulesCheck, setRulesCheck] = useState(null);
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Log auth state to console
      logAuthState();
    });

    return () => unsubscribe();
  }, []);

  const runFirebaseCheck = async () => {
    setIsRunningCheck(true);
    try {
      const results = await checkFirebaseRules();
      setRulesCheck(results);
    } catch (error) {
      setRulesCheck({
        success: false,
        message: 'Error running diagnostics: ' + error.message
      });
    } finally {
      setIsRunningCheck(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Firebase Diagnostics</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Firebase Diagnostics</h1>
      
      <div className="card" style={{ marginTop: '20px' }}>
        <h2>Authentication Status</h2>
        {user ? (
          <div>
            <div className="success-message" style={{ 
              padding: '10px', 
              borderRadius: '6px', 
              background: 'rgba(72, 187, 120, 0.1)', 
              color: 'var(--success-color)',
              marginBottom: '15px'
            }}>
              ✓ Authenticated
            </div>
            <p><strong>User ID:</strong> {user.uid}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
            <p><strong>Last Sign In:</strong> {user.metadata.lastSignInTime}</p>
          </div>
        ) : (
          <div>
            <div className="error-message">
              ✘ Not authenticated
            </div>
            <p>You need to be logged in to run Firebase diagnostics.</p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Log In
            </Link>
          </div>
        )}
      </div>
      
      {user && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h2>Firebase Rules Check</h2>
          <p>This will test your permissions to read, write, and delete notes in Firestore.</p>
          
          <button 
            onClick={runFirebaseCheck} 
            className="btn btn-primary"
            disabled={isRunningCheck}
            style={{ marginTop: '10px' }}
          >
            {isRunningCheck ? (
              <><span className="spinner-dots"></span>Running Check...</>
            ) : (
              'Run Permissions Check'
            )}
          </button>
          
          {rulesCheck && (
            <div style={{ marginTop: '20px' }}>
              <div className={rulesCheck.success ? 'success-message' : 'error-message'} style={{ marginBottom: '15px' }}>
                {rulesCheck.success ? '✓' : '✘'} {rulesCheck.message}
              </div>
              
              {rulesCheck.details && (
                <div>
                  <h3>Details:</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Object.entries(rulesCheck.details).map(([operation, result]) => (
                      <li key={operation} style={{ 
                        marginBottom: '10px', 
                        padding: '8px',
                        borderRadius: '4px',
                        background: result.success ? 'rgba(72, 187, 120, 0.1)' : 'rgba(255, 90, 95, 0.1)'
                      }}>
                        <strong>{operation.charAt(0).toUpperCase() + operation.slice(1)}:</strong>{' '}
                        {result.success ? (
                          <span style={{ color: 'var(--success-color)' }}>✓ Success</span>
                        ) : (
                          <span style={{ color: 'var(--error-color)' }}>
                            ✘ Failed{result.error ? `: ${result.error}` : ''}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="card" style={{ marginTop: '20px' }}>
        <h2>Firestore Rules</h2>
        <p>Make sure these rules are properly set in your Firebase Console:</p>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.9rem',
          marginTop: '10px'
        }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write only their own notes
    match /notes/{noteId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Default deny all other requests
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`}
        </pre>
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Link to="/" className="btn btn-secondary">Go Home</Link>
        <Link to="/notes" className="btn btn-primary">Go to Notes</Link>
      </div>
    </div>
  );
};

export default DiagnosticPage; 