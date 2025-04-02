import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const plansList = document.getElementById("plansList");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login";
    return;
  }

  const plansQuery = query(
    collection(db, "travelPlans"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(plansQuery, (snapshot) => {
    plansList.innerHTML = "";

    if (snapshot.empty) {
      plansList.innerHTML = "<p>No saved plans found.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const plan = docSnap.data();
      const id = docSnap.id;

      const card = document.createElement("div");
      card.className = "plan-card";

      let guideText = "";

      try {
        const parsed = typeof plan.guide === "string" ? JSON.parse(plan.guide) : plan.guide;
        guideText = parsed.guide || "No guide found.";
      } catch (err) {
        guideText = plan.guide || "No guide available.";
      }

      // Render as HTML like in script.js
      const formattedGuide = guideText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n{2,}/g, "</p><p>")
        .replace(/\n/g, "<br>");

      card.innerHTML = `
        <div class="plan-header">
          <h3>${plan.destination || "Destination unknown"}</h3>
          <small>${plan.createdAt?.toDate().toLocaleString() || "Date unknown"}</small>
        </div>
        <div class="guide-content">
          <p>${formattedGuide}</p>
        </div>
        <button class="delete-button" data-id="${id}">🗑️ Delete</button>
      `;

      // Delete logic
      card.querySelector(".delete-button").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this plan?")) {
          await deleteDoc(doc(db, "travelPlans", id));
        }
      });

      plansList.appendChild(card);
    });
  });
});
