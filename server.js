const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const getTravelGuide = require("./chatgpt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Add a simple route for the root URL
app.get("/", (req, res) => {
  res.send("✅ Travel Guide API is running! Use /get-travel-guide to fetch travel guides.");
});

// API Route for fetching travel guides
app.post("/get-travel-guide", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  const { preferences } = req.body;
  if (!preferences || !preferences.destination || !preferences.duration) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const guide = await getTravelGuide(preferences);
    res.json({ guide });
  } catch (error) {
    console.error("❌ Error fetching travel guide:", error);
    res.status(500).json({ error: "Failed to fetch travel guide. Please try again." });
  }
});

// Use Render’s assigned port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
