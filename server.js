const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { getItinerary } = require("./chatgpt");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/generate-itinerary", async (req, res) => {
  const { userInput } = req.body;

  try {
    const { prompt } = req.body;
    const itinerary = await getItinerary(userInput);
    res.json({ itinerary });
  } catch (error) {
    console.error("GPT error:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
