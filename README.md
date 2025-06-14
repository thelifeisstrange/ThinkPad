# ThinkPad Notes App

A full-stack notes application built with React, Node.js, and Firebase.

## Features

- User authentication with Firebase Auth
- Create, read, update, and delete notes
- Cloud storage with Firebase Firestore
- REST API with Node.js and Express

## Project Structure

The project is divided into two main parts:

- `client`: React frontend (deployed on Firebase Hosting)
- `server`: Node.js + Express backend (deployed on Render)

## Deployment

### Live Demo

- Frontend: [https://thinkpadnotesapp.web.app](https://thinkpadnotesapp.web.app)
- Backend API: [https://thinkpad-m40t.onrender.com](https://thinkpad-m40t.onrender.com)

### Frontend Deployment (Firebase)

The frontend is deployed on Firebase Hosting:

1. Build the React app:
   ```
   cd client
   npm run build
   ```

2. Deploy to Firebase:
   ```
   firebase deploy
   ```

### Backend Deployment (Render)

The backend is deployed on Render:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the settings:
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Plan**: Free

## Local Development Setup

### Firebase Setup

1. Create a Firebase project 
2. Enable Email/Password authentication in the Authentication section
3. Create a Firestore database
4. Get your Firebase configuration for the web app 

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   PORT=3000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Register a new account or log in with an existing one
2. Create, view, edit, and delete notes
3. Log out when done

