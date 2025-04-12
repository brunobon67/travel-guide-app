// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBTU9waiz51hZcBM3SeV23sVkZZzDPn7XA",
  authDomain: "travel-guide-11210.firebaseapp.com",
  projectId: "travel-guide-11210",
  storageBucket: "travel-guide-11210.firebasestorage.app",
  messagingSenderId: "578059026982",
  appId: "1:578059026982:web:f0b3082c9c2f5ea0069ce7"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ DOM Elements
const userNameSpan = document.getElementById("userName");
const userEmailSpan = document.getElementById("userEmail");
const logoutButtons = document.querySelectorAll(".logout-btn");

// ✅ Auth State Handling
onAuthStateChanged(auth, (user) => {
  if (user) {
    userNameSpan.textContent = user.displayName || "Anonymous";
    userEmailSpan.textContent = user.email || "N/A";
  } else {
    window.location.href = "/login.html";
  }
});

// ✅ Logout (works for any logout button in page)
logoutButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "/login.html";
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  });
});
