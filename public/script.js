.then(data => {
    if (data.error) {
      document.getElementById("responseContainer").innerHTML = 
        `<p style="color: red;">❌ ${data.error}</p>`;
      return;
    }

    // ✅ Improved Formatting with Icons & Structure
    const guideText = data.guide.replace(/[`$]/g, ""); 

    // 1. Split the AI-generated text by new lines
    const lines = guideText.split('\n');

    // 2. Create HTML output with emojis and formatting
    let finalHTML = "";
    
    lines.forEach(line => {
      line = line.trim();
      
      if (/^Day\s?\d+/i.test(line)) {
        // ✅ Style "Day X" as a header
        finalHTML += `<h3 style="color: #2a9d8f; margin-top: 15px;">📅 ${line}</h3>`;
      } else if (line.includes("Morning:")) {
        finalHTML += `<p>🌞 <b>Morning:</b> ${line.replace("Morning:", "").trim()}</p>`;
      } else if (line.includes("Afternoon:")) {
        finalHTML += `<p>🌆 <b>Afternoon:</b> ${line.replace("Afternoon:", "").trim()}</p>`;
      } else if (line.includes("Evening:")) {
        finalHTML += `<p>🌙 <b>Evening:</b> ${line.replace("Evening:", "").trim()}</p>`;
      } else if (line.includes("Must-visit:")) {
        finalHTML += `<p>📍 <b>Must-visit:</b> ${line.replace("Must-visit:", "").trim()}</p>`;
      } else if (line.includes("Local Food:")) {
        finalHTML += `<p>🍽️ <b>Local Food:</b> ${line.replace("Local Food:", "").trim()}</p>`;
      } else if (line.includes("Relaxation:")) {
        finalHTML += `<p>🛀 <b>Relaxation:</b> ${line.replace("Relaxation:", "").trim()}</p>`;
      } else if (line.includes("Nightlife:")) {
        finalHTML += `<p>🎶 <b>Nightlife:</b> ${line.replace("Nightlife:", "").trim()}</p>`;
      } else {
        // Regular text is displayed normally
        finalHTML += `<p>${line}</p>`;
      }
    });

    // 3. Display structured travel plan
    document.getElementById("responseContainer").innerHTML = `
      <div class="itinerary-card" style="border: 2px solid #2a9d8f; padding: 15px; border-radius: 10px; background: #f9f9f9;">
        ${finalHTML}
        <button id="savePlanBtn" class="save-plan-btn">💾 Save Plan</button>
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
