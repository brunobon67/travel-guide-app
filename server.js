const express = require('express');
const cors = require('cors');
const fs = require('fs');
const getItinerary = require('./chatgpt.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let itineraries = {};
try {
  itineraries = JSON.parse(fs.readFileSync('itineraries.json', 'utf-8'));
  console.log("✅ Loaded itineraries.json");
} catch (err) {
  console.warn("⚠️ Warning: itineraries.json not found. Fallback to ChatGPT only.");
}

app.post("/generate-itinerary", async (req, res) => {
  const { city, days, tripType } = req.body;

  if (!city || !days || !tripType) {
    return res.status(400).json({ error: "Missing city, days, or trip type." });
  }

  const cityKey = city.toLowerCase();
  const tripKey = tripType.toLowerCase();
  const dayKey = String(days);

  const itinerary = itineraries?.[cityKey]?.[dayKey]?.[tripKey]?.itinerary;

  if (itinerary) {
    console.log(`✅ Found static itinerary for ${cityKey} - ${dayKey} days - ${tripKey}`);
    return res.json({ itinerary });
  }

  // Fallback to GPT if not found
  try {
    const prompt = `Plan a ${days}-day ${tripType} trip to ${city}`;
    const gptItinerary = await getItinerary(prompt);
    console.log(`🤖 Used GPT for ${cityKey} - ${dayKey} days - ${tripKey}`);
    return res.json({ itinerary: gptItinerary });
  } catch (err) {
    console.error("❌ GPT error:", err);
    return res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

app.listen(10000, () => {
  console.log("✅ Server running on http://localhost:10000");
});
