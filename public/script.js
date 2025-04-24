document.getElementById("tripForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const city = document.getElementById("city").value;
  const duration = document.getElementById("duration").value;
  const activity = document.getElementById("activity").value;
  const notes = document.getElementById("notes").value;

  if (!city || !duration) {
    alert("Please fill out required fields.");
    return;
  }

  const prompt = `Create a detailed ${duration}-day travel itinerary for ${city}, Italy. Focus on ${activity || 'general tourist'} activities. ${notes ? 'User notes: ' + notes : ''}`;

  const guideOutput = document.getElementById("guideOutput");
  guideOutput.innerHTML = "<p>Generating itinerary... ⏳</p>";

  try {
    const response = await getItineraryFromGPT(prompt);
    guideOutput.innerHTML = `<pre>${response}</pre>`;
  } catch (error) {
    guideOutput.innerHTML = "<p>Error generating itinerary. Please try again.</p>";
    console.error("ChatGPT Error:", error);
  }
});
