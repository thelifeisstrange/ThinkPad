import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin with default credentials
const firebaseApp = initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the dist directory
const distPath = path.join(__dirname, 'dist');
console.log('Serving static files from:', distPath);

app.use(express.static(distPath));

// API Routes
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await auth.verifyIdToken(token);
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 