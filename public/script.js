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
  if (!responseContainer) return;

  responseContainer.innerHTML = `<p style="color: #2a9d8f; font-weight: bold;">⏳ Generating your travel guide...</p>`;
  responseContainer.style.display = "block";

  const preferences = {
    destination: document.getElementById("destination")?.value,
    duration: document.getElementById("duration")?.value,
    preferredActivities: document.getElementById("preferredActivities")?.value,
    nightlife: document.getElementById("nightlife")?.value
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // ⏰ 15s timeout

    const response = await fetch("/get-travel-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal,
      body: JSON.stringify({ preferences })
    });

    clearTimeout(timeoutId);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }
    } catch (readerError) {
      console.error("Stream reading error:", readerError);
      responseContainer.innerHTML = `
        <p style="color: red; font-weight: bold;">❌ Error while reading the response stream.</p>
        <p>${readerError.message}</p>
      `;
      return;
    }

    console.log("🔍 Raw result:", result);

    let guideContent = result;
    try {
      const parsed = JSON.parse(result);
      if (parsed.guide) guideContent = parsed.guide;
    } catch (e) {
      console.warn("Guide result is not valid JSON:", e);
    }

    responseContainer.innerHTML = `
      <h2>Your Travel Guide</h2>
      <div id="travel-guide-output" style="background: #f9f9f9; padding: 1rem; border-radius: 8px; font-size: 1rem; line-height: 1.6; margin-bottom: 1rem;">
        ${guideContent
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\\n/g, "<br>")
          .replace(/\n/g, "<br>")
          .replace(/```/g, "")
        }
      </div>
      <button id="saveGuideBtn" style="padding: 0.5rem 1rem; background: #2a9d8f; color: white; border: none; border-radius: 4px; cursor: pointer;">
        💾 Save this guide
      </button>
    `;

    document.getElementById("saveGuideBtn")?.addEventListener("click", async () => {
      try {
        if (currentUser && guideContent.trim()) {
          await addDoc(collection(db, "travelPlans"), {
            uid: currentUser.uid,
            createdAt: serverTimestamp(),
            preferences,
            guide: guideContent
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
    console.error("❌ Error during fetch:", error);
    responseContainer.innerHTML = `
      <p style="color: red; font-weight: bold;">❌ Something went wrong. Please try again.</p>
      <p>${error.message}</p>
    `;
  }
});

// ✅ Logout (resilient)
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error", error);
    alert("Logout failed. Please try again.");
  }
});

// ✅ Hamburger toggle
document.getElementById("menuToggle")?.addEventListener("click", () => {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.toggle("visible");
    if (window.innerWidth <= 768) {
      document.body.classList.toggle("menu-open");
    }
  }
});




