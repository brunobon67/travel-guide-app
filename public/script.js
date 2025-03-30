// ✅ Session check
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

// ✅ Form submission handler
document.getElementById("preferencesForm").addEventListener("submit", async function (event) {
  event.preventDefault();

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
    const response = await fetch("/get-travel-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ preferences: formData })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      responseContainer.innerHTML = result
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
    }

    document.getElementById("savePlanBtn").style.display = "inline-block";

    document.getElementById("savePlanBtn").addEventListener("click", function () {
      let savedPlans = JSON.parse(localStorage.getItem("travelPlans")) || [];
      savedPlans.push({
        destination: formData.destination,
        plan: result.replace(/\n/g, "<br>"),
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

// ✅ Logout button
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await fetch("/logout", {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "/login";
  });
}

