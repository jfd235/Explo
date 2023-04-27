import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

import { FIREBASE_CONFIG } from './constants';

// Initialize Firebase
const firebaseConfig = {
    apiKey: FIREBASE_CONFIG.API_KEY,
    authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
    projectId: FIREBASE_CONFIG.PROJECT_ID,
    storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
    messagingSenderId: FIREBASE_CONFIG.MESSAGE_ID,
    appId: FIREBASE_CONFIG.APP_ID,
    measurementId: FIREBASE_CONFIG.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);


const providerGoogle = new GoogleAuthProvider();
const auth = getAuth(app);
export {auth, providerGoogle};
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase