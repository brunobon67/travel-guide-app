document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("travel-form");
  const resultBox = document.getElementById("itineraryResult");
  const loading = document.getElementById("loading");

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

    // Show loading
    loading.classList.remove("hidden");
    resultBox.innerHTML = "";

    try {
      const response = await fetch("/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destination,
          duration,
          activity,
          notes
        })
      });

      const data = await response.json();
      loading.classList.add("hidden");
      resultBox.innerHTML = `<pre>${data.itinerary}</pre>`;
    } catch (error) {
      loading.classList.add("hidden");
      resultBox.innerHTML = "Something went wrong. Please try again later.";
      console.error("ChatGPT Error:", error);
    }
  });
});
