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

    // Send request to backend to generate travel guide
    fetch("https://your-backend-url/get-travel-guide", { 
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

        // Display the travel guide in the response container
        document.getElementById("responseContainer").innerHTML = `
            <div class="itinerary-card">
                ${data.guide.replace(/[`$]/g, "")}
            </div>
        `;
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
