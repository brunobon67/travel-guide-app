import { auth, onAuthStateChanged } from "./firebase.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const container = document.getElementById("savedPlansContainer");
  const savedKey = `savedPlans_${user.uid}`;
  const savedPlans = JSON.parse(localStorage.getItem(savedKey) || "[]");

  if (savedPlans.length === 0) {
    container.innerHTML = "<p>No saved plans found.</p>";
    return;
  }

  savedPlans.forEach((plan, index) => {
    const planDiv = document.createElement("div");
    planDiv.classList.add("plan");

    planDiv.innerHTML = `
      <h3>📍 Plan #${index + 1} - Saved on ${plan.date}</h3>
      <pre>${plan.itinerary}</pre>
    `;

    planDiv.addEventListener("click", () => {
      const itinerary = planDiv.querySelector("pre");
      itinerary.style.display = itinerary.style.display === "block" ? "none" : "block";
    });

    container.appendChild(planDiv);
  });
});
