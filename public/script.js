document.getElementById("preferencesForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const formData = {
        destination: document.getElementById("destination").value,
        duration: document.getElementById("duration").value,
        accommodation: document.getElementById("accommodation").value,
        preferredActivities: document.getElementById("preferredActivities").value,
        nightlife: document.getElementById("nightlife").value
    };

    // Display loading message
    document.getElementById("responseContainer").innerHTML = `
        <p style="color: #2a9d8f; font-weight: bold;">
            ⏳ Generating your travel guide... Please wait.
        </p>
    `;
    document.getElementById("responseContainer").style.display = "block"; // Show response container

    // Send request to backend to generate travel guide
    fetch("https://travel-guide-app-hdgg.onrender.com/get-travel-guide", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: formData })
    })
    .then(response => response.json())
    .then(data => {
        // If there's an error in the response, display it
        if (data.error) {
            document.getElementById("responseContainer").innerHTML = `<p style="color: red;">❌ ${data.error}</p>`;
            return;
        }

        // Display the structured travel guide in the response container
        document.getElementById("responseContainer").innerHTML = `
            <div class="itinerary-card">
                <h3><strong>Itinerary for ${formData.destination}</strong></h3>
                ${data.guide.replace(/[`$]/g, "").split('\n').map(line => {
                    if (/^Day\s?\d+/i.test(line.trim())) {
                        return `<h4>${line.trim()}</h4>`;
                    } else {
                        return `<p>${line.trim()}</p>`;
                    }
                }).join('')}
            </div>
        `;

        // Display the "Save My Plan" button
        document.getElementById("savePlanBtn").style.display = "inline-block";
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

