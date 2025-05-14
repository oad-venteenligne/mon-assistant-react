// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDzEv6ogF8bdO1xjOuC7RA62nZLsSB0TPA",
  authDomain: "oad-react.firebaseapp.com",
  projectId: "oad-react",
  storageBucket: "oad-react.firebasestorage.app",
  messagingSenderId: "852958332931",
  appId: "1:852958332931:web:2cd6f2a69ec689ff35e636",
  measurementId: "G-BXCBMYY2WC"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };
