import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { app } from "/firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("travel-form");
const responseContainer = document.getElementById("responseContainer");
const loader = document.getElementById("loader");

// 🔐 Check auth status
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login";
  }
});

// 🚀 Handle form submission
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const destination = document.getElementById("destination").value;
  const duration = document.getElementById("duration").value;
  const accommodation = document.getElementById("accommodation").value;

  const preferences = { destination, duration, accommodation };

  loader.style.display = "block";
  responseContainer.innerHTML = "";

  try {
    const response = await fetch("/get-travel-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      result += decoder.decode(value, { stream: true });

      // ✨ Enhanced live formatting
      responseContainer.innerHTML = `
        <div style="background: #f9f9f9; padding: 1rem; border-radius: 8px; font-size: 1rem; line-height: 1.6;">
          ${result
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br>")}
        </div>
      `;
    }

    loader.style.display = "none";

    // 💾 Save to Firestore
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "travelPlans"), {
        uid: user.uid,
        preferences,
        guide: result,
        createdAt: serverTimestamp()
      });
    }

  } catch (err) {
    loader.style.display = "none";
    responseContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
    console.error(err);
  }
});
