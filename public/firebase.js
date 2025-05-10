// public/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTU9waiz51hZcBM3SeV23sVkZZzDPn7XA",
  authDomain: "travel-guide-11210.firebaseapp.com",
  projectId: "travel-guide-11210",
  storageBucket: "travel-guide-11210.appspot.com",
  messagingSenderId: "578059026982",
  appId: "1:578059026982:web:f0b3082c9c2f5ea0069ce7",
  measurementId: "G-6H7KKPNTQ5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, onAuthStateChanged };

