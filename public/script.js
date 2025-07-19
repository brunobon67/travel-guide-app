:import { auth } from "/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // ---ELEMENT SELECTORS---
    const tripForm = document.getElementById("trip-form");
    const loadingIndicator = document.getElementById("loading-indicator");
    const responseContainer = document.getElementById("response-container");
    const itineraryContent = document.getElementById("itinerary-content");
    const saveButton = document.getElementById("save-button");
    const loginPopup = document.getElementById('login-popup');

    // ---AUTHENTICATION CHECK---
    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in.
            console.log("User is logged in:", user.uid);
            loginPopup.classList.add('hidden'); // Hide the popup if it's visible
        } else {
            // User is signed out.
            console.log("User is not logged in.");
            loginPopup.classList.remove('hidden'); // Show the login popup
        }
    });

    // ---FORM SUBMISSION LOGIC---
    if (tripForm) {
        tripForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent the browser from reloading the page

            // 1. Get form data
            const destination = document.getElementById("destination").value;
            const days = document.getElementById("days").value;
            const preferences = document.getElementById("preferences").value;

            // Basic validation
            if (!destination || !days || !preferences) {
                alert("Please fill out all fields!"); // Simple alert for now
                return;
            }

            // 2. Update UI to show loading state
            responseContainer.classList.add("hidden");
            loadingIndicator.classList.remove("hidden");
            itineraryContent.innerHTML = ""; // Clear previous results

            try {
                // 3. Send data to the server
                const response = await fetch("/generate-itinerary", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        city: destination,
                        days: parseInt(days), // Ensure days is a number
                        preferences: preferences, // Send the preferences!
                    }),
                });

                if (!response.ok) {
                    // Handle server errors (e.g., 500 status)
                    throw new Error(`Server error: ${response.statusText}`);
                }

                const data = await response.json();

                // 4. Display the result
                itineraryContent.innerText = data.itinerary; // Use innerText to prevent HTML injection
                responseContainer.classList.remove("hidden");
                saveButton.classList.remove("hidden");

            } catch (error) {
                console.error("Failed to generate itinerary:", error);
                itineraryContent.innerText = "Sorry, something went wrong. We couldn't generate your itinerary. Please try again later.";
                responseContainer.classList.remove("hidden");
                saveButton.classList.add("hidden");
            } finally {
                // 5. Hide loading indicator regardless of outcome
                loadingIndicator.classList.add("hidden");
            }
        });
    }
});
