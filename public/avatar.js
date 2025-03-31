// public/avatar.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Dropdown toggle
const toggle = document.getElementById("userMenuToggle");
const dropdown = document.getElementById("userDropdown");

if (toggle && dropdown) {
  toggle.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

// Logout
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed", err);
  }
});

// Placeholders
document.getElementById("profile-link")?.addEventListener("click", () => {
  alert("👤 Coming soon: User profile page");
});
document.getElementById("plans-link")?.addEventListener("click", () => {
  alert("🧳 Coming soon: Saved travel plans");
});

// Redirect to login if not authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login";
  }
});

