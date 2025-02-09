const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const getTravelGuide = require("./chatgpt"); // Import ChatGPT logic

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001; // ✅ Use Render's dynamic port

// API Route to generate a travel guide
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

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
