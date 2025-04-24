document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trip-form");
  const resultContainer = document.getElementById("result");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const city = document.getElementById("city").value;
      const duration = document.getElementById("duration").value;
      const season = document.getElementById("season").value;
      const travelType = document.getElementById("travel-type").value;
      const activity = document.getElementById("activity").value;

      if (!city || !duration || !season || !travelType || !activity) {
        alert("Please fill out all fields.");
        return;
      }

      // Show loading state
      resultContainer.innerHTML = `<p>Generating your itinerary... Please wait.</p>`;

      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            city,
            duration,
            season,
            travelType,
            activity
          })
        });

        const data = await response.json();

        if (response.ok && data.itinerary) {
          resultContainer.innerHTML = `<pre>${data.itinerary}</pre>`;
        } else {
          resultContainer.innerHTML = `<p>Failed to generate itinerary. ${data.error || "Please try again later."}</p>`;
        }
      } catch (error) {
        console.error("Error generating itinerary:", error);
        resultContainer.innerHTML = `<p>An error occurred. Please try again.</p>`;
      }
    });
  }
});
