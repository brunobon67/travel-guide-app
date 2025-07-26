import { auth } from "/firebase.js";

const form = document.getElementById('trip-form');
const cityInput = document.getElementById('destination');
const tripTypeInput = document.getElementById('tripType'); // ✅ new
const responseContainer = document.getElementById('chatgpt-response');
const loadingMessage = document.getElementById('loading-message');
const saveButton = document.getElementById('save-button');

const dayError = document.getElementById('day-error');
const daysInput = form.querySelector('input[name="days"]:checked');

// Clear error initially
dayError.style.display = 'none';

if (!daysInput) {
  dayError.style.display = 'block';
  return; // Stop form submission
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim().toLowerCase();
  const daysInput = form.querySelector('input[name="days"]:checked');
  const days = daysInput ? parseInt(daysInput.value) : null;
  const tripType = tripTypeInput.value.trim().toLowerCase(); // ✅ new

  if (!city || isNaN(days) || !tripType) return;

  loadingMessage.textContent = "⏳ Generating your travel guide...";
  responseContainer.innerHTML = "";
  saveButton.style.display = "none";

  try {
    const res = await fetch('/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, days, tripType }) // ✅ includes tripType
    });

    const data = await res.json();
    loadingMessage.textContent = "";

    if (!data.itinerary) throw new Error("No itinerary returned.");

const formatted = formatItineraryToHTML(data.itinerary);
responseContainer.innerHTML = `<div class="itinerary-box">${formatted}</div>`;

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

    saveButton.style.display = "inline-block";

    saveButton.onclick = () => {
      const user = auth.currentUser;
      if (!user) return alert("You must be logged in to save.");
      const key = `savedPlans_${user.uid}`;
      const saved = JSON.parse(localStorage.getItem(key)) || [];
      saved.push({ date: new Date().toLocaleString(), itinerary: data.itinerary });
      localStorage.setItem(key, JSON.stringify(saved));
      alert("✅ Travel guide saved!");
    };
  } catch (err) {
    console.error("ChatGPT Error:", err);
    loadingMessage.textContent = "⚠️ Error generating itinerary.";
  }
});
