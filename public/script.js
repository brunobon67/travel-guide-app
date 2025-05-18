const form = document.getElementById('trip-form');
const cityInput = document.getElementById('city');
const daysInput = document.getElementById('days');
const responseContainer = document.getElementById('chatgpt-response');
const loadingMessage = document.getElementById('loading-message');
const saveButton = document.getElementById('save-button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim().toLowerCase();
  const days = parseInt(daysInput.value.trim());

  if (!city || isNaN(days)) return;

  loadingMessage.textContent = "⏳ Generating your travel guide...";
  responseContainer.innerHTML = "";
  saveButton.style.display = "none";

  try {
    const res = await fetch('/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, days })
    });

    const data = await res.json();
    loadingMessage.textContent = "";

    if (!data.itinerary) throw new Error("No itinerary returned.");

    const formatted = data.itinerary.replace(/\n/g, "<br>");
    responseContainer.innerHTML = `<div class="itinerary-box">${formatted}</div>`;
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
