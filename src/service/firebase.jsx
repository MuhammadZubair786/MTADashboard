// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJJk9eAj1YKBoVGHThXt3_9EH2P-UoY68",
  authDomain: "freedom-elite.firebaseapp.com",
  projectId: "freedom-elite",
  storageBucket: "freedom-elite.appspot.com",
  messagingSenderId: "353192285363",
  appId: "1:353192285363:web:f893781a5749884ec9ccc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);