import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCAmTaSeJydmfCztmNQG5JnxFLkLmlXxUg",
    authDomain: "explo-b7866.firebaseapp.com",
    projectId: "explo-b7866",
    storageBucket: "explo-b7866.appspot.com",
    messagingSenderId: "623728735787",
    appId: "1:623728735787:web:a2d499ab64429ae9ee1c6e",
    measurementId: "G-Y4EKPMKJ3R"
};

const app = initializeApp(firebaseConfig);


const providerGoogle = new GoogleAuthProvider();
const auth = getAuth(app);
export {auth, providerGoogle};
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
