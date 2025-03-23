# ThinkPad Notes - Client

## Features

- User authentication (login, register)
- Create, read, update, and delete notes
- Responsive design for all devices

## Getting Started

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Create a `.env` file in the root directory with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Development

Start the development server: 

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

### Building for Production

```bash
npm run build
# or
yarn build
```

The build will be created in the `dist` directory.

## Project Structure

```
client/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── firebase/     # Firebase configuration
│   ├── pages/        # Application pages/views
│   ├── styles/       # CSS files
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Application entry point
├── .env              # Environment variables (not in repo)
└── index.html        # HTML entry point
```
