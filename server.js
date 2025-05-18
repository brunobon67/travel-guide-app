const express = require('express');
const cors = require('cors');
const fs = require('fs');
const getItinerary = require('./chatgpt.js');

const app = express(); // ✅ This must be defined BEFORE app.post()

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let itineraries = {};
try {
  itineraries = JSON.parse(fs.readFileSync('itineraries.json', 'utf-8'));
} catch (err) {
  console.warn("⚠️ Warning: itineraries.json not found, fallback to GPT only.");
}

app.post("/generate-itinerary", async (req, res) => {
  const { city, days } = req.body;
  if (!city || !days) {
    return res.status(400).json({ error: "Missing city or days." });
  }

  const key = `${city.toLowerCase()}-${days}`;
  const existing = itineraries[key];

  if (existing) {
    return res.json({ itinerary: existing.itinerary });
  }

  try {
    const prompt = `Plan a ${days}-day trip to ${city}`;
    const itinerary = await getItinerary(prompt);
    res.json({ itinerary });
  } catch (err) {
    console.error("GPT error:", err);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

app.listen(10000, () => {
  console.log("✅ Server running on http://localhost:10000");
});


