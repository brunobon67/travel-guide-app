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

  // ✅ Fix: Use relative URL instead of hardcoded API link (for local & production compatibility)
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

    // 1. Split the AI-generated text by new lines
    const lines = guideText.split('\n');

    // 2. Build HTML for each line with enhanced formatting
    let finalHTML = lines.map(line => {
      line = line.trim();

      if (/^Day\s?\d+/i.test(line)) {
        return `<h3 class="day-title" style="color: #2a9d8f; font-size: 1.5em; margin-top: 15px;">📅 ${line}</h3>`;
      } else if (line.includes("Morning:")) {
        return `<p><strong>🌞 Morning:</strong> ${line.replace("Morning:", "").trim()}</p>`;
      } else if (line.includes("Afternoon:")) {
        return `<p><strong>🌆 Afternoon:</strong> ${line.replace("Afternoon:", "").trim()}</p>`;
      } else if (line.includes("Evening:")) {
        return `<p><strong>🌙 Evening:</strong> ${line.replace("Evening:", "").trim()}</p>`;
      } else if (line.includes("Must-visit:")) {
        return `<p><strong>📍 Must-Visit:</strong> ${line.replace("Must-visit:", "").trim()}</p>`;
      } else if (line.includes("Local Food:")) {
        return `<p><strong>🍽️ Local Food:</strong> ${line.replace("Local Food:", "").trim()}</p>`;
      } else {
        return `<p>${line}</p>`;
      }
    }).join("");

    // 3. Wrap it in a "card" container for better styling
    document.getElementById("responseContainer").innerHTML = `
      <div class="itinerary-card" style="border: 2px solid #2a9d8f; padding: 15px; border-radius: 10px; background: #f9f9f9; max-width: 800px; margin: 0 auto;">
        ${finalHTML}
        <button id="savePlanBtn" class="save-plan-btn" style="margin-top: 20px; background-color: #2a9d8f; color: white; padding: 10px; border-radius: 5px;">💾 Save Plan</button>
      </div>
    `;

    // 4. Attach the Save Plan event
    document.getElementById("savePlanBtn").addEventListener("click", function() {
      let savedPlans = JSON.parse(localStorage.getItem("travelPlans")) || [];
      savedPlans.push({
        destination: formData.destination,
        plan: guideText,
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

// ✅ Fix: Ensure the button to view saved plans is added only once
document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("viewSavedPlansBtn")) {
    const viewSavedPlansBtn = document.createElement("button");
    viewSavedPlansBtn.innerText = "📂 View Saved Plans";
    viewSavedPlansBtn.id = "viewSavedPlansBtn";
    viewSavedPlansBtn.style.marginTop = "20px";
    viewSavedPlansBtn.onclick = function() {
      window.location.href = "saved-plans.html";
    };

    document.querySelector(".container").appendChild(viewSavedPlansBtn);
  }
});

