import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
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

// Middleware
app.use(cors({
  origin: 'https://thinkpadnotesapp.web.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 