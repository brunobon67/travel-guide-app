import { auth } from "./firebase.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trip-form');
  const userInput = document.getElementById('user-input');
  const responseContainer = document.getElementById('chatgpt-response');
  const loadingMessage = document.getElementById('loading-message');
  const saveButton = document.getElementById('save-button');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputText = userInput.value.trim();
    if (!inputText) return;

    loadingMessage.textContent = "⏳ Generating your travel guide...";
    responseContainer.innerHTML = "";
    saveButton.style.display = "none";

    try {
      const res = await fetch('/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: inputText })
      });

      const data = await res.json();

      loadingMessage.textContent = "";

      if (!data.itinerary) {
        throw new Error("No itinerary returned from server.");
      }

      const formattedResponse = data.itinerary.replace(/\n/g, '<br>');
responseContainer.innerHTML = `
  <div class="itinerary-box">
    ${formattedResponse}
  </div>
`;

      saveButton.style.display = "inline-block";

      saveButton.onclick = () => {
        const user = auth.currentUser;
        if (!user) {
          alert("You must be logged in to save travel plans.");
          return;
        }

        const savedKey = `savedPlans_${user.uid}`;
        const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
        saved.push({ date: new Date().toLocaleString(), itinerary: data.itinerary });
        localStorage.setItem(savedKey, JSON.stringify(saved));
        alert('✅ Travel guide saved!');
      };

    } catch (err) {
      console.error('ChatGPT Error:', err);
      loadingMessage.textContent = "⚠️ Error generating itinerary. Please try again.";
    }
  });
});
