const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const getTravelGuide = require("./chatgpt (13).js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ".")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index (28).html"));
});

// Generate Itinerary route
app.post("/generate-itinerary", async (req, res) => {
  const { city, duration, season, travelType, activity } = req.body;

  const preferences = {
    destination: city,
    duration,
    preferredActivities: activity,
    notes: `Season: ${season}, Travel type: ${travelType}`
  };

  try {
    const gptResponse = await getTravelGuide(preferences);
    const itinerary = gptResponse.choices[0]?.message?.content || "No response from GPT.";
    res.json({ itinerary });
  } catch (error) {
    console.error("GPT error:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

// Fallback for 404
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
