// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps  } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "prepwise-7ccd1.firebaseapp.com",
  projectId: "prepwise-7ccd1",
  storageBucket: "prepwise-7ccd1.firebasestorage.app",
  messagingSenderId: "676384395861",
  appId: "1:676384395861:web:53d3536268f617607cfadc",
  measurementId: "G-09VM0Q4WTE"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);