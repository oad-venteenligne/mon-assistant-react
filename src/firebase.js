// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase - REMPLACEZ par VOS identifiants copiés depuis la console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA67p7DM-1MVK9AutUc2PEOwPnGomQNnBI",
    authDomain: "app-react-oad-vente-en-ligne.firebaseapp.com",
    projectId: "app-react-oad-vente-en-ligne",
    storageBucket: "app-react-oad-vente-en-ligne.firebasestorage.app",
    messagingSenderId: "148985238480",
    appId: "1:148985238480:web:f44ae1dc17dbe601cadfd5",
    measurementId: "G-J1W37G4YLF"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };