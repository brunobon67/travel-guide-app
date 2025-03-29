fetch("/session-status", { credentials: "include" })
  .then(res => res.json())
  .then(data => {
    if (!data.loggedIn) {
      window.location.href = "/login";
    } else {
      const welcome = document.getElementById("welcomeMessage");
      if (welcome) {
        welcome.textContent = `Welcome, ${data.user.name}`;
      }
    }
  });




document.getElementById("preferencesForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const responseContainer = document.getElementById("responseContainer");
    responseContainer.innerHTML = `<p style="color: #2a9d8f; font-weight: bold;">⏳ Generating your travel guide...</p>`;
    responseContainer.style.display = "block";

    const formData = {
        destination: document.getElementById("destination").value,
        duration: document.getElementById("duration").value,
        accommodation: document.getElementById("accommodation").value,
        preferredActivities: document.getElementById("preferredActivities").value,  // This includes Relax, Cultural Events, City Tour
        nightlife: document.getElementById("nightlife").value
    };

    try {
       const response = await fetch("/get-travel-guide", { 
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ preferences: formData }),
  credentials: "include"
});


        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value);

            // ✅ Properly format response while streaming
            responseContainer.innerHTML = result
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert Markdown **bold** to <strong>
                .replace(/\n/g, "<br>"); // Preserve line breaks
        }

        // ✅ Show Save Plan button when guide is generated
        document.getElementById("savePlanBtn").style.display = "inline-block";

        // ✅ Save itinerary locally
        document.getElementById("savePlanBtn").addEventListener("click", function () {
            let savedPlans = JSON.parse(localStorage.getItem("travelPlans")) || [];
            savedPlans.push({
                destination: formData.destination,
                plan: result.replace(/\n/g, "<br>"), // ✅ Preserve formatting when saving
                date: new Date().toLocaleDateString()
            });

            localStorage.setItem("travelPlans", JSON.stringify(savedPlans));
            alert("✅ Travel plan saved successfully!");
        });

    } catch (error) {
        console.error("❌ Error:", error);
        responseContainer.innerHTML = `
            <p style="color: red; font-weight: bold;">❌ Something went wrong. Please try again.</p>
            <p>${error.message}</p>
        `;
    }
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  await fetch("/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "/login";
});

