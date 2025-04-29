import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Replace these with your own Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyA1LZUtwnB9fwFIWJnOlUNhW4bQ51gDldQ",
    authDomain: "persona-ai-5e9ff.firebaseapp.com",
    projectId: "persona-ai-5e9ff",
    storageBucket: "persona-ai-5e9ff.firebasestorage.app",
    messagingSenderId: "470385465611",
    appId: "1:470385465611:web:58ca0ba4d485b2d1b5aa0e",
    measurementId: "G-PNHK3E0PWX"
  };
  
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, sendPasswordResetEmail, sendEmailVerification };
