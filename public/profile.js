// profile.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login";
  } else {
    document.getElementById("displayName").textContent = user.displayName || "N/A";
    document.getElementById("email").textContent = user.email;
    document.getElementById("uid").textContent = user.uid;
  }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "/login";
});

document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "/app";
});
