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

      // 👇 Create hidden guide content
      const guideText = document.createElement("div");
      guideText.className = "guide-preview";
      guideText.innerHTML = (plan.guide || "").replace(/\n/g, "<br>");
      guideText.style.display = "none";

      button.addEventListener("click", () => {
   let guideString = "";

// If guide is a stringified JSON, parse it
try {
  const parsed = typeof plan.guide === "string" ? JSON.parse(plan.guide) : plan.guide;
  guideString = parsed.guide || parsed;
} catch {
  guideString = plan.guide || "No guide found.";
}

// Format it nicely
guideText.innerHTML = guideString
  .replace(/\\n/g, "<br>")               // double slashes
  .replace(/\n/g, "<br>")                // actual newlines
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // markdown bold
  .replace(/```/g, "")                   // strip triple backticks
  .replace(/"guide":/, "");              // just in case

guideText.className = "guide-preview";
guideText.style.display = "none";


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
