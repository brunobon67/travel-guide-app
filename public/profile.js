// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MSG_SENDER_ID",
  appId: "YOUR_APP_ID"
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
