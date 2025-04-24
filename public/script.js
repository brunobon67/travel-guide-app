document.getElementById("travel-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const destination = document.getElementById("destination").value;
  const duration = document.getElementById("duration").value;
  const preferredActivities = document.getElementById("activity").value;
  const notes = document.getElementById("notes").value;

  const preferences = {
    destination,
    duration,
    preferredActivities,
    nightlife: notes
  };

  try {
    const response = await fetch("/get-travel-guide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ preferences })
    });

    const data = await response.json();

    const outputDiv = document.getElementById("itinerary-result");
    outputDiv.innerHTML = response.ok ? `<pre>${data.guide}</pre>` : `<p>Error: ${data.error}</p>`;
  } catch (err) {
    console.error("ChatGPT Error:", err);
    document.getElementById("itinerary-result").innerHTML = "<p>Something went wrong. Please try again.</p>";
  }
});
