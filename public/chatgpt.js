const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-itinerary", async (req, res) => {
  const { city, duration, season, travelType, activity } = req.body;

  if (!city || !duration || !season || !travelType || !activity) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const prompt = `
Create a ${duration}-day travel itinerary for a trip to ${city}, Italy.
The season is ${season} and the traveler prefers a ${travelType} experience focused on ${activity}.
Make sure to include a day-by-day breakdown with descriptions.
`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const itinerary = chatCompletion.choices[0].message.content;
    res.json({ itinerary });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

module.exports = router;

