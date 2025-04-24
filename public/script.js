document.getElementById("travel-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.getElementById("destination").value;
  const duration = document.getElementById("duration").value;
  const activity = document.getElementById("activity").value;
  const notes = document.getElementById("notes").value;

  try {
    const response = await fetch("/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city,
        duration,
        season: "spring", // default value
        travelType: notes,
        activity
      }),
    });

    const data = await response.json();
    const outputDiv = document.getElementById("itinerary-result");
    outputDiv.innerHTML = response.ok
      ? `<pre>${data.itinerary}</pre>`
      : `<p>Error: ${data.error}</p>`;
  } catch (err) {
    console.error("ChatGPT Error:", err);
    document.getElementById("itinerary-result").innerHTML = "<p>Something went wrong. Please try again.</p>";
  }
});
