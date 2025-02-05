import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,RecaptchaVerifier, signInWithPhoneNumber  } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = true;
const provider = new GoogleAuthProvider();

export { auth, provider,RecaptchaVerifier, signInWithPhoneNumber };