// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmrJOcB1B6vUcDXxaHTBHvUttMEaZUp_M",
  authDomain: "life-log-31981.firebaseapp.com",
  projectId: "life-log-31981",
  storageBucket: "life-log-31981.firebasestorage.app",
  messagingSenderId: "1073662717744",
  appId: "1:1073662717744:web:c6cfd73b10dc8f919ce2f5",
  measurementId: "G-517NK2R5F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
