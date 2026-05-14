import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

let app;
let auth;

try {
  if (!firebaseConfig.apiKey) {
    console.error('🔥 FIREBASE CONFIGURATION ERROR: VITE_FIREBASE_API_KEY is missing.');
  }
  
  // Provide a dummy config if missing to prevent fatal crash, 
  // though auth will fail when used, the app UI will at least load!
  app = initializeApp(firebaseConfig.apiKey ? firebaseConfig : {
    apiKey: "dummy-key",
    authDomain: "dummy.firebaseapp.com",
    projectId: "dummy-project"
  });
  
  auth = getAuth(app);
} catch (error) {
  console.error("🔥 Firebase init failed:", error);
}

let analytics = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    analytics = null;
  });
}

export { auth, app, analytics };
