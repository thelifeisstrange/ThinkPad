# ThinkPad Notes App

A full-stack notes application built with React, Node.js, and Firebase.

## Features

- User authentication with Firebase Auth
- Create, read, update, and delete notes
- Cloud storage with Firebase Firestore
- Modern and responsive UI
- REST API with Node.js and Express

## Project Structure

The project is divided into two main parts:

- `client`: React frontend
- `server`: Node.js + Express backend

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Firebase account

## Setup Instructions

### Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in the Authentication section
3. Create a Firestore database
4. Get your Firebase configuration for the web app (you'll need the config values for both client and server)

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
   PORT=5000
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

## License

MIT 