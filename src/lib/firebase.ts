// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  setPersistence, 
  browserSessionPersistence,
  type Auth
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error("Firebase config is not set. Please create a .env.local file with your Firebase credentials or set them in your hosting provider's environment variables.");
    }
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const db = getFirestore(app);
const auth: Auth = getAuth(app);

// A promise that resolves once persistence is set.
// This should only run on the client-side.
const persistenceInitialized = typeof window !== 'undefined' 
    ? setPersistence(auth, browserSessionPersistence).catch(error => {
        console.error("Firebase: Could not set session persistence.", error);
      })
    : Promise.resolve();


export { db, auth, persistenceInitialized };
