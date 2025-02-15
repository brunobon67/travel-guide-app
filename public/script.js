// Listen for form submission
document.getElementById("preferencesForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const formData = {
    destination: document.getElementById("destination").value,
    duration: document.getElementById("duration").value,
    accommodation: document.getElementById("accommodation").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  // Debugging: Log the form data to check for errors
  console.log("Sending request with data:", formData);

  // Show Loading Message
  document.getElementById("responseContainer").innerHTML = `
    <p style="color: #2a9d8f; font-weight: bold;">
      ⏳ Generating your travel guide... Please wait.
    </p>
  `;
  document.getElementById("responseContainer").style.display = "block"; // Make sure it's visible

  // Send request to backend to generate travel guide
  fetch("https://travel-guide-app-hdgg.onrender.com/get-travel-guide", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: formData })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error) {
      document.getElementById("responseContainer").innerHTML = 
        `<p style="color: red;">❌ ${data.error}</p>`;
      return;
    }

    // Escape special characters to avoid syntax errors
    const guideText = data.guide.replace(/[`$]/g, "");

    // Split the AI-generated text by new lines and format it
    const lines = guideText.split('\n');
    let finalHTML = lines.map(line => {
      if (/^Day\s?\d+/i.test(line.trim())) {
        return `<h3 class="day-title">${line.trim()}</h3>`;
      } else {
        return `<p>${line.trim()}</p>`;
      }
    }).join("");

    // Display the generated travel guide in the response container
    document.getElementById

