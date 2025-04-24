const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { getChatGPTResponse } = require("./chatgpt");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate-itinerary", async (req, res) => {
  const { prompt } = req.body;

  try {
    const itinerary = await getChatGPTResponse(prompt);
    res.json({ itinerary });
  } catch (error) {
    console.error("Failed to generate itinerary:", error);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
