document.getElementById("tripForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const city = document.getElementById("city").value;
  const duration = document.getElementById("duration").value;
  const activity = document.getElementById("activity").value;
  const notes = document.getElementById("notes").value;

  if (!city || !duration) {
    alert("Please fill out all required fields.");
    return;
  }

  const preferences = {
    destination: city,
    duration: duration,
    preferredActivities: activity,
    nightlife: notes
  };

  const output = document.getElementById("guideOutput");
  output.innerHTML = "Generating itinerary...";

  try {
    const guide = await getItineraryFromGPT(preferences);
    output.innerText = guide;
  } catch (error) {
    output.innerText = "Failed to generate itinerary. Please try again later.";
  }
});


fetch('/api/generate-itinerary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: yourPrompt })
})
.then(res => res.json())
.then(data => {
  // Display result
});
