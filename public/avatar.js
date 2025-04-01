import { auth } from "/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const avatarBtn = document.getElementById("avatar-btn");
const dropdown = document.getElementById("dropdown");

avatarBtn?.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

document.getElementById("logout")?.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "/login";
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Logged in as", user.email);
  } else {
    window.location.href = "/login";
  }
});


