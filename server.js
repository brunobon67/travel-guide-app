require("dotenv").config(); // ✅ Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const getTravelGuide = require("./chatgpt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

app.post("/get-travel-guide", async (req, res) => {
  const { preferences } = req.body;
  if (!preferences || !preferences.destination || !preferences.duration) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const guide = await getTravelGuide(preferences);
    res.json({ guide });
  } catch (error) {
    console.error("❌ Error fetching travel guide:", error);
    res.status(500).json({ error: "Failed to fetch travel guide." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
