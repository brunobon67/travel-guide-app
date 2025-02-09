document.getElementById("preferencesForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const formData = {
    destination: document.getElementById("destination").value,
    duration: document.getElementById("duration").value,
    budget: document.getElementById("budget").value,
    accommodation: document.getElementById("accommodation").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  // ✅ Ensure this URL includes the correct backend endpoint
  fetch("https://travel-guide-app-hdgg.onrender.com/get-travel-guide", {
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
