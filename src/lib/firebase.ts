
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let db;

try {
  if (!firebaseConfig.projectId) {
    console.error("FATAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set. Firebase SDK cannot be initialized properly.");
    // throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set.");
  }
  if (!firebaseConfig.apiKey) {
    console.warn("WARN: NEXT_PUBLIC_FIREBASE_API_KEY environment variable is not set. Some Firebase services might not work as expected.");
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  console.log("Firebase SDK initialized successfully.");
} catch (error) {
  console.error("FATAL: Error initializing Firebase SDK. This is likely due to missing or incorrect Firebase environment variables.", error);
  // In a real app, you might want to throw this error to prevent the app from starting
  // or provide a fallback mechanism.
  // For now, 'db' will be undefined, and subsequent Firestore operations will fail.
  // throw error; 
}

export { db }; // db might be undefined if initialization failed
