document.getElementById("preferencesForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const formData = {
    destination: document.getElementById("destination").value,
    duration: document.getElementById("duration").value,
    accommodation: document.getElementById("accommodation").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  // ✅ Show Loading Message
  document.getElementById("responseContainer").innerHTML = `
    <p style="color: #007bff; font-weight: bold;">⏳ Generating your travel guide... Please wait.</p>
  `;

  // ✅ Ensure this URL includes the correct backend endpoint
  fetch("https://travel-guide-app-hdgg.onrender.com/get-travel-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: formData }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error) {
      document.getElementById("responseContainer").innerHTML = `<p style="color: red;">❌ ${data.error}</p>`;
      return;
    }

    // ✅ Format response by converting **Day 1**, **Day 2** into bold
    let formattedGuide = data.guide.replace(/(Day \d+)/g, "<strong>$1</strong>");
    document.getElementById("responseContainer").innerHTML = `
      <h3>🌍 Your Travel Guide</h3>
      <p>${formattedGuide.replace(/\n/g, "<br>")}</p>
    `;
  })
  .catch(error => {
    console.error("❌ Error:", error);
    document.getElementById("responseContainer").innerHTML = `
      <p style="color: red; font-weight: bold;">❌ Something went wrong. Please try again.</p>
      <p>${error.message}</p>
    `;
  });
});
