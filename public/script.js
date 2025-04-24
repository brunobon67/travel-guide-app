document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("travel-form");
  const output = document.getElementById("output");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const city = document.getElementById("destination").value;
      const duration = document.getElementById("duration").value;
      const season = document.getElementById("season").value;
      const travelType = document.getElementById("travel-type").value;
      const activity = document.getElementById("activity").value;

      if (!city || !duration || !season || !travelType || !activity) {
        output.innerHTML = "<p style='color:red'>Please fill in all fields.</p>";
        return;
      }

      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ city, duration, season, travelType, activity }),
        });

        const data = await response.json();

        if (data.itinerary) {
          output.innerHTML = `<pre>${data.itinerary}</pre>`;
        } else {
          output.innerHTML = `<p style="color:red">${data.error || "Failed to generate itinerary."}</p>`;
        }
      } catch (err) {
        console.error("ChatGPT Error:", err);
        output.innerHTML = "<p style='color:red'>An error occurred while generating the itinerary.</p>";
      }
    });
  }
});
