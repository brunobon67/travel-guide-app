require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const getTravelGuide = require("./chatgpt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root Route - Health Check
app.get("/", (req, res) => {
  res.send("✅ Travel Guide API is running! Use /get-travel-guide to fetch travel guides.");
});

// ✅ API Route for Travel Guide
app.post("/get-travel-guide", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  const { preferences } = req.body;
  if (!preferences || !preferences.destination || !preferences.duration || !preferences.budget || !preferences.accommodation) {
    console.warn("⚠️ Missing required fields:", preferences);
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const guide = await getTravelGuide(preferences);
    res.json({ guide });
  } catch (error) {
    console.error("❌ Error fetching travel guide:", error);
    res.status(500).json({
      error: "Failed to fetch travel guide. Please check the server logs for details."
    });
  }
});

// ✅ Use Render’s assigned port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
