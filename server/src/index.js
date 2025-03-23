const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID', 
  'FIREBASE_STORAGE_BUCKET'
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set these variables in your .env file');
  process.exit(1);
}

// Initialize Express app
const app = express();

try {
  // Initialize Firebase Admin
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
  
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('ThinkPad Notes API is running');
});

// API Routes
// Verify token middleware
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken.split('Bearer ')[1]);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Unauthorized' });
  }
};

// Get all notes for a user
app.get('/api/notes', verifyToken, async (req, res) => {
  try {
    const notesRef = db.collection('notes');
    const snapshot = await notesRef.where('userId', '==', req.user.uid).get();
    
    if (snapshot.empty) {
      return res.json([]);
    }
    
    const notes = [];
    snapshot.forEach(doc => {
      notes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(notes);
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({ error: 'Failed to get notes' });
  }
});

// Get a single note
app.get('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const noteRef = db.collection('notes').doc(req.params.id);
    const doc = await noteRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const noteData = doc.data();
    
    // Verify that the note belongs to the requesting user
    if (noteData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access to this note' });
    }
    
    res.json({
      id: doc.id,
      ...noteData
    });
  } catch (error) {
    console.error('Error getting note:', error);
    res.status(500).json({ error: 'Failed to get note' });
  }
});

// Create a new note
app.post('/api/notes', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const newNote = {
      title,
      content,
      userId: req.user.uid,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('notes').add(newNote);
    
    res.status(201).json({
      id: docRef.id,
      ...newNote
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
app.put('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // Check if note exists and belongs to user
    const noteRef = db.collection('notes').doc(noteId);
    const doc = await noteRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const noteData = doc.data();
    
    if (noteData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access to this note' });
    }
    
    const updatedNote = {
      title,
      content,
      updatedAt: new Date().toISOString()
    };
    
    await noteRef.update(updatedNote);
    
    res.json({
      id: noteId,
      ...noteData,
      ...updatedNote
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
app.delete('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    
    // Check if note exists and belongs to user
    const noteRef = db.collection('notes').doc(noteId);
    const doc = await noteRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const noteData = doc.data();
    
    if (noteData.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access to this note' });
    }
    
    await noteRef.delete();
    
    res.json({ id: noteId, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 