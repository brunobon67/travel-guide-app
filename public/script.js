document.getElementById("preferencesForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  // Collect form data
  const formData = {
    destination: document.getElementById("destination").value,
    duration: document.getElementById("duration").value,
    groupSize: document.getElementById("groupSize").value,
    tripType: document.getElementById("tripType").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  // Show loading message
  document.getElementById("responseContainer").innerHTML = `<p>⏳ Generating your travel guide...</p>`;

  // ✅ Update this URL with your Render backend URL!
  fetch("https://your-app.onrender.com/get-travel-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: formData }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      document.getElementById("responseContainer").innerHTML = `<p style="color: red;">❌ ${data.error}</p>`;
      return;
    }

    // Display travel guide
    document.getElementById("responseContainer").innerHTML = `
      <h3>🌍 Your Travel Guide</h3>
      <p>${data.guide.replace(/\n/g, "<br>")}</p>
    `;
  })
  .catch(error => {
    console.error("❌ Error:", error);
    document.getElementById("responseContainer").innerHTML = `<p style="color: red;">❌ Something went wrong. Please try again.</p>`;
  });
});
