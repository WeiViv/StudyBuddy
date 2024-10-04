// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtUHyFNDDtuPVwmH9mNCXa6o2qE_kF6OA",
  authDomain: "studybuddy-8086e.firebaseapp.com",
  projectId: "studybuddy-8086e",
  storageBucket: "studybuddy-8086e.appspot.com",
  messagingSenderId: "677938268288",
  appId: "1:677938268288:web:b74725ffd461455c76be65",
  measurementId: "G-EKR2SD2LE8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
