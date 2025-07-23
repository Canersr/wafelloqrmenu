// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
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
const app: FirebaseApp = getApps().length 
    ? getApp() 
    : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db = getFirestore(app);

// A promise that resolves once persistence is set.
// This should only run on the client-side.
const persistenceInitialized = (async () => {
    if (typeof window !== 'undefined') {
        try {
            await setPersistence(auth, browserSessionPersistence);
        } catch (error) {
            console.error("Firebase: Could not set session persistence.", error);
        }
    }
})();

export { db, auth, persistenceInitialized };
