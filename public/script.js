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

  // ✅ Correct Fetch Syntax
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
      document.getElementById("responseContainer").innerHTML = `<p style="color: red;">❌ ${data.error}</p>`;
      return;
    }

    // ✅ Fix: Format Response Correctly
    let formattedGuide = data.guide.replace(/(Day \d+)/g, "<strong>$1</strong>");

    // Display Plan to User
    document.getElementById("responseContainer").innerHTML = `
      <h3>Your Travel Guide</h3>
      <p>${formattedGuide.replace(/\n/g, "<br>")}</p>
      <button id="savePlanBtn">Save Plan</button>
    `;

    // ✅ Fix: Add Event Listener Inside .then()
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
      <p style="color: red; font-weight: bold;">❌ Something went wrong. Please try again.</p>
      <p>${error.message}</p>
    `;
  });
});

// ✅ Fix: Ensure View Saved Plans Button is Created Correctly
document.addEventListener("DOMContentLoaded", function () {
  const viewSavedPlansBtn = document.createElement("button");
  viewSavedPlansBtn.innerText = "📂 View Saved Plans";
  viewSavedPlansBtn.style.marginTop = "20px";
  viewSavedPlansBtn.onclick = function() {
    window.location.href = "saved-plans.html";
  };

  document.querySelector(".container").appendChild(viewSavedPlansBtn);
});
