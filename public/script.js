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

    loadingMessage.textContent = "⏳ We are generating your travel guide...";
    responseContainer.innerHTML = "";
    saveButton.style.display = "none";

    try {
      const res = await fetch('/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: inputText })
      });

      const data = await res.json();
      loadingMessage.textContent = "";
      responseContainer.innerHTML = `<div>${data.itinerary.replace(/\n/g, '<br>')}</div>`;
      saveButton.style.display = "inline-block";

      // Save latest itinerary
      saveButton.onclick = () => {
        const savedPlans = JSON.parse(localStorage.getItem('savedPlans')) || [];
        savedPlans.push({
          date: new Date().toLocaleString(),
          itinerary: data.itinerary
        });
        localStorage.setItem('savedPlans', JSON.stringify(savedPlans));
        alert('Travel guide saved!');
      };

    } catch (error) {
      console.error('ChatGPT Error:', error);
      loadingMessage.textContent = "⚠️ Failed to generate itinerary. Please try again.";
    }
  });
});
