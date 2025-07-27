import { auth } from "/firebase.js";

const form = document.getElementById('trip-form');
const cityInput = document.getElementById('destination');
const tripTypeInput = document.getElementById('tripType');
const responseContainer = document.getElementById('chatgpt-response');
const loadingMessage = document.getElementById('loading-message');
const saveButton = document.getElementById('save-button');
const dayError = document.getElementById('day-error');
const hiddenDaysInput = document.getElementById('days');

// Day button logic
document.querySelectorAll('.day-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Set value in hidden input
    hiddenDaysInput.value = button.dataset.value;

    // Style buttons
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Hide error
    dayError.style.display = 'none';
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous error
  dayError.style.display = 'none';

  const city = cityInput.value.trim().toLowerCase();
  const tripType = tripTypeInput.value.trim().toLowerCase();
  const days = hiddenDaysInput.value;

  if (!days) {
    dayError.style.display = 'block';
    return;
  }

  if (!city || !tripType) return;

  loadingMessage.textContent = "⏳ Generating your travel guide...";
  responseContainer.innerHTML = "";
  saveButton.style.display = "none";

  try {
    const res = await fetch('/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, days: parseInt(days), tripType })
    });

    const data = await res.json();
    loadingMessage.textContent = "";

    if (!data.itinerary) throw new Error("No itinerary returned.");

    const formatted = formatItineraryToHTML(data.itinerary);
    document.getElementById("scroll-indicator").style.display = "block";
    responseContainer.innerHTML = `<div class="itinerary-box">${formatted}</div>`;
    saveButton.style.display = "inline-block";

    saveButton.onclick = () => {
const user = auth.currentUser;
if (!user) {
  const goToLogin = confirm("🔐 You must be logged in to save your itinerary.\n\nClick OK to go to login.\nClick Cancel to stay here.");
  if (goToLogin) {
    window.location.href = "/login.html";
  }
  return;
}

      const key = `savedPlans_${user.uid}`;
      const saved = JSON.parse(localStorage.getItem(key)) || [];
      saved.push({
  date: new Date().toLocaleString(),
  itinerary: data.itinerary,
  city,
  days,
  tripType
});

      localStorage.setItem(key, JSON.stringify(saved));
      alert("✅ Travel guide saved!");
    };
  } catch (err) {
    console.error("ChatGPT Error:", err);
    loadingMessage.textContent = "⚠️ Error generating itinerary.";
  }
});

function formatItineraryToHTML(text) {
  const lines = text.split("\n");
  let html = "";
  lines.forEach(line => {
    if (line.trim() === "---") {
      html += "<hr>";
    } else if (line.startsWith("🏛️") || line.startsWith("🛀") || line.startsWith("🍝")) {
      html += `<h2>${line}</h2>`;
    } else if (line.startsWith("🕘") || line.startsWith("🍝") || line.startsWith("🍕") || line.startsWith("🌇") || line.startsWith("🎭") || line.startsWith("🎶")) {
      html += `<h3>${line}</h3>`;
    } else if (line.match(/^\d{1,2}:\d{2}/)) {
      html += `<p><strong>${line}</strong></p>`;
    } else if (line.trim() !== "") {
      html += `<p>${line}</p>`;
    }
  });
  return html;
}
