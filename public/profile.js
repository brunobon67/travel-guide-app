import { auth } from "/firebase.js"; // ✅ reuses your existing setup
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// DOM Elements
const userNameSpan = document.getElementById("userName");
const userEmailSpan = document.getElementById("userEmail");
const logoutButtons = document.querySelectorAll(".logout-btn");

// Auth State Handling
onAuthStateChanged(auth, (user) => {
  if (user) {
    userNameSpan.textContent = user.displayName || "Anonymous";
    userEmailSpan.textContent = user.email || "N/A";
  } else {
    window.location.href = "/login.html";
  }
});

// Logout
logoutButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "/login.html";
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  });
});
