const fs = require('fs');
const itineraries = JSON.parse(fs.readFileSync('itineraries.json', 'utf-8'));

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

