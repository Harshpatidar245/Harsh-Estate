// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ab84e.firebaseapp.com",
  projectId: "mern-estate-ab84e",
  storageBucket: "mern-estate-ab84e.firebasestorage.app",
  messagingSenderId: "206066682953",
  appId: "1:206066682953:web:68400f387928549fbc4398",
  measurementId: "G-1DCB957VK3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);