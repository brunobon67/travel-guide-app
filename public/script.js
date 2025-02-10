document.getElementById("preferencesForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const formData = {
    destination: document.getElementById("destination").value,
    duration: document.getElementById("duration").value,
    accommodation: document.getElementById("accommodation").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  // Show Loading Message
  document.getElementById("responseContainer").innerHTML = `
    <p style="color: #2a9d8f; font-weight: bold;">⏳ Generating your travel guide... Please wait.</p>
  `;

  // Fetch Travel Guide from Server
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

    // Format Response with Bold for Day Titles
    let formattedGuide = data.guide.replace(/(Day \d+)/g, "<strong>$1</strong>");
    
    // Display Plan to User
    document.getElementById("responseContainer").innerHTML = `
      <h3>Your Travel Guide</h3>
      <p>${formattedGuide.replace(/\n/g, "<br>")}</p>
      <button id="savePlanBtn">Save Plan</button>
    `;

    // Save to Local Storage
    document.getElementById("savePlanBtn").addEventListener("click", () => {
      let savedPlans = JSON.parse(lo

