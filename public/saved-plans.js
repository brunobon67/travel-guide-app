document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("savedPlansContainer");
  const savedPlans = JSON.parse(localStorage.getItem("savedPlans") || "[]");

  if (savedPlans.length === 0) {
    container.innerHTML = "<p>No saved plans found.</p>";
    return;
  }

  savedPlans.forEach((plan, index) => {
    const planDiv = document.createElement("div");
    planDiv.classList.add("plan");

    planDiv.innerHTML = `
      <h3>Plan #${index + 1} - Saved on ${plan.date}</h3>
      <pre>${plan.itinerary}</pre>
      <hr />
    `;

    container.appendChild(planDiv);
  });
});
