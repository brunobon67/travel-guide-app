import { auth } from "/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("expanded");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      menu &&
      menu.classList.contains("expanded") &&
      !hamburger.contains(e.target) &&
      !menu.contains(e.target)
    ) {
      menu.classList.remove("expanded");
    }
  });

  // ✅ Shared logout logic for all pages
  const logoutLink = document.getElementById("logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault(); // prevent <a href="#"> from jumping to top
      signOut(auth)
        .then(() => {
          alert("You have been logged out.");
          window.location.href = "/login.html";
        })
        .catch((error) => {
          console.error("Logout error:", error);
          alert("Failed to log out. Please try again.");
        });
    });
  }
});
