const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const getTravelGuide = require("./chatgpt");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/generate-itinerary", async (req, res) => {
  const { city, duration, season, travelType, activity } = req.body;

  const preferences = {
    destination: city,
    duration,
    preferredActivities: activity,
    nightlife: `Season: ${season}, Travel Type: ${travelType}`
  };

  try {
    const gptResponse = await getTravelGuide(preferences);
    const itinerary = gptResponse.choices[0]?.message?.content || "No itinerary returned.";
    res.json({ itinerary });
  } catch (error) {
    console.error("GPT Error:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
