document.getElementById("preferencesForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = {
    destination: document.getElementById("destination").value,
    startDate: document.getElementById("startDate").value,
    duration: document.getElementById("duration").value,
    budget: document.getElementById("budget").value,
    accommodation: document.getElementById("accommodation").value,
    preferredActivities: document.getElementById("preferredActivities").value,
    nightlife: document.getElementById("nightlife").value
  };

  fetch("http://localhost:3001/get-travel-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: formData }),
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("responseContainer").innerHTML = `<h3>Your Travel Guide:</h3><p>${data.guide.replace(/\n/g, '<br>')}</p>`;
  })
  .catch(error => console.error("Error:", error));
});
