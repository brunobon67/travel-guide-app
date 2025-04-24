// generate-itinerary.js
const express = require("express");
const router = express.Router();
const getTravelGuide = require("./chatgpt");

router.post("/", async (req, res) => {
  const { city, duration, activity, notes } = req.body;

  if (!city || !duration || !activity) {
    return res.status(400).json({ error: "Missing fields." });
  }

  const preferences = {
    destination: city,
    duration,
    preferredActivities: activity,
    nightlife: notes || "None",
  };

  try {
    const itinerary = await getTravelGuide(preferences);
    res.json({ itinerary });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

module.exports = router;
