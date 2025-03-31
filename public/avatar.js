import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { app } from "./firebase.js";

const auth = getAuth(app);

// 🔄 Toggle the dropdown menu
const toggle = document.getElementById("userMenuToggle");
const dropdown = document.getElementById("userDropdown");

if (toggle && dropdown) {
  toggle.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // Close the dropdown when clicking outside
  window.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

// 🚪 Logout button
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error", error);
    alert("Logout failed. Please try again.");
  }
});

// 👤 Profile link (can be expanded later)
document.getElementById("profile-link")?.addEventListener("click", () => {
  alert("👤 Coming soon: User profile page");
});

// 🧳 Saved Plans link (placeholder)
document.getElementById("plans-link")?.addEventListener("click", () => {
  alert("🧳 Coming soon: Saved travel plans page");
});

// 🔐 Protect the page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login";
  }
});
