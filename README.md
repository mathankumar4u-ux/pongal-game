# Pongal Quiz Game

A real-time quiz game web application for Pongal cultural events, supporting 100-150 participants on mobile devices.

## Features

- **Real-time gameplay**: Questions sync instantly across all devices
- **Mobile-first design**: Touch-friendly UI optimized for mobile data
- **Admin dashboard**: Manage questions and control game flow
- **Auto-generated IDs**: Participants receive unique IDs (qtmp_001, qtmp_002, etc.)
- **Scoring system**: +10 correct, -5 wrong, 0 timeout
- **20-second timer**: Per question with visual countdown
- **Final leaderboard**: Scores revealed only at game end

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Firebase (Firestore, Hosting)
- **Real-time**: Firestore listeners with offline persistence

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" → Enter project name → Continue
3. Disable Google Analytics (optional) → Create Project
4. In project dashboard, click web icon (</>) to add a web app
5. Register app name → Copy the firebaseConfig values
6. Go to **Build → Firestore Database** → Create database → Start in test mode
7. Go to **Build → Hosting** → Get started

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_PASSWORD=your_secure_password
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Add Logo

Place your `qtmlogo.png` file in the `public/` folder.

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 for participant view, http://localhost:5173/admin for admin dashboard.

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (if not already done):
```bash
firebase init
```
Select Hosting and Firestore.

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Game Flow

### Admin Flow
1. Login at `/admin` with password
2. Add questions before the event
3. Open registration for participants
4. Wait for participants to join
5. Close registration (starts game, releases Q1)
6. Release questions one by one after each performance
7. End game to show final leaderboard

### Participant Flow
1. Open the app URL on mobile
2. Tap "Join Game" to get a unique ID
3. Save the ID for reference
4. Wait for questions
5. Answer within 20 seconds
6. See final rank when game ends

## Scoring

| Action | Points |
|--------|--------|
| Correct answer | +10 |
| Wrong answer | -5 |
| No answer/timeout | 0 |

**Note**: Scores are hidden during the game and revealed only at the end.

## Project Structure

```
pongal-game/
├── public/
│   └── qtmlogo.png
├── src/
│   ├── components/
│   │   ├── admin/       # Admin dashboard components
│   │   ├── common/      # Shared components
│   │   └── participant/ # Participant view components
│   ├── contexts/        # React contexts
│   ├── services/        # Firebase services
│   ├── utils/           # Constants and helpers
│   ├── pages/           # Page components
│   └── App.jsx          # Main app with routing
├── firestore.rules      # Security rules
├── firebase.json        # Firebase config
└── .env.local           # Environment variables
```

## Troubleshooting

### Build warnings about chunk size
This is normal due to Firebase SDK. The app will work fine.

### "Registration is not open" error
Make sure the admin has opened registration from the dashboard.

### Questions not syncing
Check your internet connection. The app has offline support but needs connection to sync.

## License

MIT
