# ThinkPad Notes - Server

The backend API for ThinkPad Notes application, built with Node.js, Express, and Firebase Admin.

## Features

- Authentication verification with Firebase Admin
- RESTful API for CRUD operations on notes
- CORS configured for the frontend domain

## Deployment

This server is configured for deployment on [Render](https://render.com).

### Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000

# Firebase Config
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-auth-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
GOOGLE_CLIENT_ID=your-google-client-id
```

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: thinkpad-notes-backend (or your preferred name)
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Plan**: Free
   
4. Add all environment variables from your `.env` file
5. Click "Create Web Service"

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will be available at http://localhost:3000 by default.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/verify | Verify Firebase ID token |
| GET    | /health | Health check endpoint |

## Technologies Used

- Node.js
- Express
- Firebase Admin SDK
- CORS middleware for cross-origin requests 