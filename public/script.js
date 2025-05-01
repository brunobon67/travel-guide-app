document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("travel-form");
  const output = document.getElementById("itinerary");
  const loading = document.getElementById("loading");
  const saveBtn = document.getElementById("save-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInput = document.getElementById("userInput").value.trim();

    if (!userInput) return;

    output.innerHTML = "";
    loading.style.display = "block";
    saveBtn.style.display = "none";

    try {
      const response = await fetch("/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      loading.style.display = "none";

      if (data.itinerary) {
        output.innerHTML = formatItinerary(data.itinerary);
        saveBtn.style.display = "inline-block";
      } else {
        output.innerHTML = "Sorry, something went wrong.";
      }
    } catch (error) {
      loading.style.display = "none";
      output.innerHTML = "Error: " + error.message;
    }
  });

  window.saveItinerary = function () {
    const itinerary = output.innerText;
    if (itinerary) {
      localStorage.setItem("savedItinerary", itinerary);
      alert("Travel guide saved! 🗺️ You can view it in 'My Saved Plans'.");
    }
  };
});

function formatItinerary(text) {
  const paragraphs = text.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`);
  return paragraphs.join("");
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}

function logout() {
  alert("You have been logged out.");
  // Add real logout logic here if needed
}
