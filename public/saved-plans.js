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

      card.innerHTML = `
        <h3>${plan.destination || "Destination unknown"}</h3>
        <small>${plan.createdAt?.toDate().toLocaleString() || "Date unknown"}</small>
        <p>${plan.guide.slice(0, 200)}...</p>
        <button data-id="${id}">Delete</button>
      `;

      // Delete plan on click
      card.querySelector("button").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this plan?")) {
          await deleteDoc(doc(db, "travelPlans", id));
        }
      });

      plansList.appendChild(card);
    });
  });
});
