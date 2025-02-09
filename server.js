require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const getTravelGuide = require("./chatgpt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root Route - Health Check (Returns JSON)
app.get("/", (req, res) => {
  res.json({ message: "✅ Travel Guide API is running!" }); // ✅ JSON Response
});

// ✅ API Route for Travel Guide
app.post("/get-travel-guide", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  const { preferences } = req.body;
  if (!preferences || !preferences.destination || !preferences.duration || !preferences.accommodation) {
    console.warn("⚠️ Missing required fields:", preferences);
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const guide = await getTravelGuide(preferences);
    res.json({ guide }); // ✅ Return JSON
  } catch (error) {
    console.error("❌ ERROR:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch travel guide. Please check the server logs for details." });
  }
});

// ✅ Use Render’s assigned port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
