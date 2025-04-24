document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("travel-form");
  const resultDiv = document.getElementById("itineraryResult");
  const loading = document.getElementById("loading");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destination = document.getElementById("destination").value;
    const duration = document.getElementById("duration").value;
    const activity = document.getElementById("activity").value;
    const notes = document.getElementById("notes").value;

    const prompt = `Create a travel itinerary for a ${duration}-day trip to ${destination}, focusing on ${activity}. Notes: ${notes}`;

    resultDiv.innerHTML = "";
    loading.classList.remove("hidden");

    try {
      const response = await fetch("/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      loading.classList.add("hidden");

      resultDiv.innerHTML = data.itinerary;
    } catch (err) {
      loading.classList.add("hidden");
      resultDiv.innerHTML = "Something went wrong while generating your itinerary. Please try again.";
      console.error("ChatGPT Error:", err);
    }
  });
});
