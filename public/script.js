document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("travel-form");
  const resultBox = document.getElementById("itineraryResult");
  const loading = document.getElementById("loading");
  const saveBtn = document.getElementById("saveBtn");

  let currentItinerary = "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destination = document.getElementById("destination").value;
    const duration = document.getElementById("duration").value;
    const activity = document.getElementById("activity").value;
    const notes = document.getElementById("notes").value;

    if (!destination || !duration || !activity) {
      alert("Please fill out all required fields.");
      return;
    }

    loading.classList.remove("hidden");
    resultBox.innerHTML = "";
    saveBtn.classList.add("hidden");

    try {
      const response = await fetch("/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ destination, duration, activity, notes })
      });

      const data = await response.json();
      currentItinerary = data.itinerary;

      loading.classList.add("hidden");
      resultBox.innerHTML = `<pre>${currentItinerary}</pre>`;
      saveBtn.classList.remove("hidden");
    } catch (error) {
      loading.classList.add("hidden");
      resultBox.innerHTML = "Something went wrong. Please try again later.";
      console.error("ChatGPT Error:", error);
    }
  });

  saveBtn.addEventListener("click", () => {
    if (currentItinerary) {
      const savedPlans = JSON.parse(localStorage.getItem("savedPlans") || "[]");
      savedPlans.push({
        date: new Date().toLocaleString(),
        itinerary: currentItinerary
      });
      localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
      alert("Travel guide saved successfully!");
    }
  });
});
