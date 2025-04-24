document.getElementById("travel-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const destination = document.getElementById("destination").value;
  const duration = document.getElementById("duration").value;
  const activities = document.getElementById("activity").value;
  const notes = document.getElementById("notes").value;

  const prompt = `Generate a detailed travel itinerary for a trip to ${destination} for ${duration} days. Preferred activities include: ${activities}. Additional notes: ${notes}`;

  try {
    const response = await fetch("/api/generate-itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.itinerary) {
      document.getElementById("itinerary-result").innerText = data.itinerary;
    } else {
      document.getElementById("itinerary-result").innerText = "No itinerary received.";
    }

  } catch (error) {
    console.error("ChatGPT Error:", error);
    document.getElementById("itinerary-result").innerText = "An error occurred. Please try again.";
  }
});
