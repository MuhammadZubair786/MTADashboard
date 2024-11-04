// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAleN2PwkrDRsRv2MY8aiaWBUHYQkNVKvY',
  authDomain: 'freedom-elite-dashboard.firebaseapp.com',
  projectId: 'freedom-elite-dashboard',
  storageBucket: 'freedom-elite-dashboard.firebasestorage.app',
  messagingSenderId: '811486276459',
  appId: '1:811486276459:web:a52e66ac5661d96c25fa2e',
  measurementId: 'G-HVSDCVQLDX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
