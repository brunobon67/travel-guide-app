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

  // Show Loading Message
  document.getElementById("responseContainer").innerHTML = `
    <p style="color: #2a9d8f; font-weight: bold;">
      ⏳ Generating your travel guide... Please wait.
    </p>
  `;

  // Make the request
  fetch("https://travel-guide-app-hdgg.onrender.com/get-travel-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: formData })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error) {
      document.getElementById("responseContainer").innerHTML = 
        \`<p style="color: red;">❌ \${data.error}</p>\`;
      return;
    }

    // 1. Split the AI-generated text by new lines
    const lines = data.guide.split('\\n');

    // 2. Build HTML for each line
    let finalHTML = lines.map(line => {
      // If a line starts with "Day X" (case-insensitive), style it as a heading
      if (/^Day\\s?\\d+/i.test(line.trim())) {
        return \`<h3 class="day-title">\${line.trim()}</h3>\`;
      } else {
        // Otherwise, just wrap it in a paragraph
        return \`<p>\${line.trim()}</p>\`;
      }
    }).join("");

    // 3. Wrap it in a "card" container
    document.getElementById("responseContainer").innerHTML = \`
      <div class="itinerary-card">
        \${finalHTML}
        <button id="savePlanBtn" class="save-plan-btn">Save Plan</button>
      </div>
    \`;

    // 4. Attach the Save Plan event
    document.getElementById("savePlanBtn").addEventListener("click", function() {
      let savedPlans = JSON.parse(localStorage.getItem("travelPlans")) || [];
      savedPlans.push({
        destination: formData.destination,
        plan: data.guide,
        date: new Date().toLocaleDateString()
      });

      localStorage.setItem("travelPlans", JSON.stringify(savedPlans));
      alert("✅ Travel plan saved successfully!");
    });
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

// Create "View Saved Plans" button dynamically
document.addEventListener("DOMContentLoaded", function () {
  const viewSavedPlansBtn = document.createElement("button");
  viewSavedPlansBtn.innerText = "📂 View Saved Plans";
  viewSavedPlansBtn.style.marginTop = "20px";
  viewSavedPlansBtn.onclick = function() {
    window.location.href = "saved-plans.html";
  };

  document.querySelector(".container").appendChild(viewSavedPlansBtn);
});
