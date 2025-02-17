document.getElementById("preferencesForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const responseContainer = document.getElementById("responseContainer");
    responseContainer.innerHTML = `<p style="color: #2a9d8f; font-weight: bold;">⏳ Generating your travel guide...</p>`;
    responseContainer.style.display = "block";

    const formData = {
        destination: document.getElementById("destination").value,
        duration: document.getElementById("duration").value,
        accommodation: document.getElementById("accommodation").value,
        preferredActivities: document.getElementById("preferredActivities").value,
        nightlife: document.getElementById("nightlife").value
    };

    try {
        const response = await fetch("https://travel-guide-app-hdgg.onrender.com", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferences: formData })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value);
            responseContainer.innerHTML = result;
        }

        // ✅ Show Save Plan button when guide is generated
        document.getElementById("savePlanBtn").style.display = "inline-block";

        // ✅ Save itinerary locally
        document.getElementById("savePlanBtn").addEventListener("click", function () {
            let savedPlans = JSON.parse(localStorage.getItem("travelPlans")) || [];
            savedPlans.push({
                destination: formData.destination,
                plan: result,
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
