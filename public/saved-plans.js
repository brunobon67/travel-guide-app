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

      const destination = plan.preferences?.destination || "Unknown place";
      const duration = plan.preferences?.duration || "?";

      const wrapper = document.createElement("div");
      wrapper.className = "saved-plan";

      const button = document.createElement("button");
      button.className = "plan-button";
      button.innerText = `📍 ${destination} — ${duration} days`;

      const guideText = document.createElement("div");
      guideText.className = "guide-preview";
      guideText.style.display = "none";

      button.addEventListener("click", () => {
        let guideString = "";

        try {
          const parsed = typeof plan.guide === "string" ? JSON.parse(plan.guide) : plan.guide;
          guideString = parsed.guide || parsed;
        } catch {
          guideString = plan.guide || "No guide found.";
        }

        guideText.innerHTML = guideString
          .replace(/\\n/g, "<br>")
          .replace(/\n/g, "<br>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/```/g, "")
          .replace(/"guide":/, "");

        guideText.style.display = guideText.style.display === "none" ? "block" : "none";
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-button-inline";
      deleteBtn.innerText = "🗑️";

      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this plan?")) {
          await deleteDoc(doc(db, "travelPlans", id));
        }
      });

      wrapper.appendChild(button);
      wrapper.appendChild(deleteBtn);
      wrapper.appendChild(guideText);
      plansList.appendChild(wrapper);
    });
  });
});
