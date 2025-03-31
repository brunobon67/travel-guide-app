import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let currentUser = null;

// ✅ Ensure the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("✅ Logged in as", user.email);
  } else {
    console.log("❌ Not authenticated. Redirecting...");
    window.location.href = "/login";
  }
});

// ✅ Handle form submission and guide generation
document.getElementById("preferencesForm")?.addEventListener("submit", async function (event) {
  event.preventDefault();

  const responseContainer = document.getElementById("responseContainer");
  responseContainer.innerHTML = `<p style="color: #2a9d8f; font-weight: bold;">⏳ Generating your travel guide...</p>`;
  responseContainer.style.display = "block";

  const preferences = {
    destination: document.getElementById("destination").value,
    duration: document.getElementById("duration").value,
    accommodation: document.getElementById("accommodation").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  try {
    const response = await fetch("/get-travel-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ preferences })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      responseContainer.innerHTML = result
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
    }

    // ✅ Save plan to Firestore
    if (currentUser && result.trim()) {
      await addDoc(collection(db, "travelPlans"), {
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
        preferences,
        guide: result
      });
      console.log("📥 Travel guide saved to Firestore");
    }

  } catch (error) {
    console.error("❌ Error:", error);
    responseContainer.innerHTML = `
      <p style="color: red; font-weight: bold;">❌ Something went wrong. Please try again.</p>
      <p>${error.message}</p>
    `;
  }
});

// ✅ Logout button (in dropdown)
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error", error);
  }
});

// ✅ Dropdown toggle logic
document.getElementById("userMenuToggle")?.addEventListener("click", () => {
  const dropdown = document.getElementById("userDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// ✅ Profile and plans links
document.getElementById("profile-link")?.addEventListener("click", () => {
  window.location.href = "/profile.html";
});

document.getElementById("plans-link")?.addEventListener("click", () => {
  window.location.href = "/saved-plans.html";
});

