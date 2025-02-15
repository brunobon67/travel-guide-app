document.getElementById("preferencesForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const formData = {
    destination: document.getElementById("destination").value,
    duration: document.getElementById("duration").value,
    accommodation: document.getElementById("accommodation").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  // Ensure form data is not empty before proceeding
  if (!formData.destination || !formData.duration || !formData.accommodation) {
    alert("Please fill out all required fields!");
    return;
  }

  document.getElementById("responseContainer").innerHTML = `
    <p style="color: #2a9d8f; font-weight: bold;">
      ⏳ Generating your travel guide... Please wait.
    </p>
  `;

  // ✅ Fetch data from the backend API
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

    // ✅ Fix: Escape special characters to avoid syntax errors
    const guideText = data.guide.replace(/[`$]/g, ""); 

    // 1. Open new window for displaying the plan
    const travelWindow = window.open("", "Travel Plan", "width=800,height=600,scrollbars=yes");

    // 2. Build HTML for the new window
    let finalHTML = `<h1 style="color: #2a9d8f; text-align: center;">🗺️ Travel Plan for ${formData.destination}</h1>`;
    const lines = guideText.split('\n');

    lines.forEach(line => {
      line = line.trim();

      if (/^Day\s?\d+/i.test(line)) {
        finalHTML += `<h2 style="color: #2a9d8f; font-size: 1.5em;">📅 ${line}</h2>`;
      } else if (line.includes("Morning:")) {
        finalHTML += `<p><strong>🌞 Morning:</strong> ${line.replace("Morning:", "").trim()}</p>`;
      } else if (line.includes("Afternoon:")) {
        finalHTML += `<p><strong>🌆 Afternoon:</strong> ${line.replace("Afternoon:", "").trim()}</p>`;
      } else if (line.includes("Evening:")) {
        finalHTML += `<p><strong>🌙 Evening:</strong> ${line.replace("Evening:", "").trim()}</p>`;
      } else if (line.includes("Must-visit:")) {
        finalHTML += `<p><strong>📍 Must-Visit:</strong> ${line.replace("Must-visit:", "").trim()}</p>`;
        // Add image of must-visit place (can be a static or dynamic URL based on the destination)
        finalHTML += `<img src="https://source.unsplash.com/800x600/?${formData.destination}" alt="Must Visit Image" style="width: 100%; height: auto; border-radius: 10px;">`;
      } else if (line.includes("Local Food:")) {
        finalHTML += `<p><strong>🍽️ Local Food:</strong> ${line.replace("Local Food:", "").trim()}</p>`;
      } else {
        finalHTML += `<p>${line}</p>`;
      }
    });

    finalHTML += `
      <p style="text-align: center;">
        <button onclick="window.print();" style="background-color: #2a9d8f; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          🖨️ Print This Plan
        </button>
      </p>
    `;

    // Inject the generated content into the new window
    travelWindow.document.write(`
      <html>
        <head>
          <title>Travel Plan</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { font-size: 24px; color: #2a9d8f; }
            p { font-size: 16px; line-height: 1.5; }
            img { margin-top: 15px; border-radius: 10px; }
            button { background-color: #2a9d8f; color: white; padding: 10px; border-radius: 5px; cursor: pointer; }
          </style>
        </head>
        <body>
          ${finalHTML}
        </body>
      </html>
    `);
  })
  .catch(error => {
    console.error("❌ Error:", error);
    document.getElementById("responseContainer").innerHTML = `
      <p style="color: red; font-weight: bold;">
        ❌ Something went wrong. Please try again.
      </p>
      <p>${error.message}</p>
    `;
  });
});
