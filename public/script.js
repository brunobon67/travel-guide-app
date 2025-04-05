import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let currentUser = null;

// ✅ Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("✅ Logged in as", user.email);
  } else {
    console.log("❌ Not authenticated. Redirecting...");
    window.location.href = "/login";
  }
});

// ✅ Guide Generation
document.getElementById("preferencesForm")?.addEventListener("submit", async (event) => {
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

      responseContainer.innerHTML = `
        <h2>Your Travel Guide</h2>
        <div id="travel-guide-output" style="background: #f9f9f9; padding: 1rem; border-radius: 8px; font-size: 1rem; line-height: 1.6; margin-bottom: 1rem;">
          ${result
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\\n/g, "<br>")
            .replace(/\n/g, "<br>")
            .replace(/```/g, "")
            .replace(/"{/g, "{")
            .replace(/}"/g, "}")
            .replace(/^"guide":/g, "")
          }
        </div>
        <button id="saveGuideBtn" style="padding: 0.5rem 1rem; background: #2a9d8f; color: white; border: none; border-radius: 4px; cursor: pointer;">
          💾 Save this guide
        </button>
      `;
    }

    // ✅ Attach save logic after rendering
    document.getElementById("saveGuideBtn")?.addEventListener("click", async () => {
      try {
        if (currentUser && result.trim()) {
          await addDoc(collection(db, "travelPlans"), {
            uid: currentUser.uid,
            createdAt: serverTimestamp(),
            preferences,
            guide: result
          });
          alert("✅ Travel guide saved to your account!");
        } else {
          alert("⚠️ You must be logged in to save.");
        }
      } catch (err) {
        console.error("Save error:", err);
        alert("❌ Failed to save travel guide.");
      }
    });

  } catch (error) {
    console.error("❌ Error:", error);
    responseContainer.innerHTML = `
      <p style="color: red; font-weight: bold;">❌ Something went wrong. Please try again.</p>
      <p>${error.message}</p>
    `;
  }
});

// ✅ Logout (non-inline)
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error", error);
  }
});

// ✅ Hamburger toggle
document.getElementById("menuToggle")?.addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("visible");
});


