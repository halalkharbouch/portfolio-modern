// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import dotenv from "dotenv";

dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "portfolio-ejs.firebaseapp.com",
  projectId: "portfolio-ejs",
  storageBucket: "portfolio-ejs.appspot.com",
  messagingSenderId: "485365448209",
  appId: "1:485365448209:web:4ab3eefac86bb3cf6f3bb0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
