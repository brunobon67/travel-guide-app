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
    // Create accordion button
    const button = document.createElement("button");
    button.className = "accordion";
const cityName = plan.city?.charAt(0).toUpperCase() + plan.city?.slice(1) || "Trip";
const tripType = plan.tripType?.charAt(0).toUpperCase() + plan.tripType?.slice(1) || "";
button.innerText = `📌 ${cityName}, ${plan.days} day trip, ${tripType}`;

    // Create hidden panel
    const panel = document.createElement("div");
    panel.className = "panel";

    const pre = document.createElement("pre");
    pre.textContent = plan.itinerary;

    panel.appendChild(pre);
    container.appendChild(button);
    container.appendChild(panel);

    button.addEventListener("click", () => {
      button.classList.toggle("active");
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});
