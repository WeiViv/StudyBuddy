import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAtUHyFNDDtuPVwmH9mNCXa6o2qE_kF6OA',
  authDomain: 'studybuddy-8086e.firebaseapp.com',
  projectId: 'studybuddy-8086e',
  storageBucket: 'studybuddy-8086e.appspot.com',
  messagingSenderId: '677938268288',
  appId: '1:677938268288:web:b74725ffd461455c76be65',
  measurementId: 'G-EKR2SD2LE8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
