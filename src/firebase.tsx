// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYqsrsJqp4RM-wOq42R78sYUxk-2rxoY4",
  authDomain: "it-log-f2691.firebaseapp.com",
  projectId: "it-log-f2691",
  storageBucket: "it-log-f2691.appspot.com",
  messagingSenderId: "827060926528",
  appId: "1:827060926528:web:0aad84be678dd0ffff07a5",
  measurementId: "G-8M4LHMQ6JV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
