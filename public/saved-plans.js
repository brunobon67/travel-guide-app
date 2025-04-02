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

      const formattedGuide = formatGuide(plan.guide || "");

      card.innerHTML = `
        <div class="plan-header">
          <h3>${plan.destination || "Destination unknown"}</h3>
          <small>${plan.createdAt?.toDate().toLocaleString() || "Date unknown"}</small>
        </div>
        <div class="plan-content">${formattedGuide}</div>
        <button class="delete-btn" data-id="${id}">🗑 Delete</button>
      `;

      card.querySelector("button").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this plan?")) {
          await deleteDoc(doc(db, "travelPlans", id));
        }
      });

      plansList.appendChild(card);
    });
  });
});

// Helper function to format the guide string into structured HTML
function formatGuide(guide) {
  const sections = guide.split("\n\n").filter(s => s.trim() !== "");
  return sections.map((section) => {
    const [title, ...rest] = section.split("\n");
    const content = rest.join("<br>");
    return `
      <div class="guide-section">
        <h4>${title}</h4>
        <p>${content}</p>
      </div>
    `;
  }).join("");
}

