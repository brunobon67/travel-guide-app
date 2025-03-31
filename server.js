require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const getTravelGuide = require("./chatgpt");

const app = express();
const cache = {};

// CORS setup
const allowedOrigins = [
  "https://travel-app-guide.netlify.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Content Security Policy (for Firebase + fonts)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": [
        "'self'",
        "https://www.gstatic.com",
        "https://www.googleapis.com"
      ],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      "connect-src": [
        "'self'",
        "https://www.googleapis.com",
        "https://firebase.googleapis.com",
        "https://identitytoolkit.googleapis.com"
      ],
      "font-src": ["'self'", "https://fonts.gstatic.com"]
    }
  })
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("public"));

// 📄 Serve public pages
app.get("/", (req, res) => res.redirect("/login.html"));
app.get("/app", (req, res) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "public", "index.html")); // ✅ MUST point to public
});

app.get("/login", (req, res) => res.redirect("/login.html"));
app.get("/register", (req, res) => res.redirect("/register.html"));

// 🌍 Travel guide generator — no session check (Firebase handles auth on frontend)
app.post("/get-travel-guide", async (req, res) => {
  const { preferences } = req.body;
  if (!preferences || !preferences.destination || !preferences.duration || !preferences.accommodation) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  const cacheKey = JSON.stringify(preferences);
  if (cache[cacheKey]) {
    return res.json({ guide: cache[cacheKey] });
  }

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await getTravelGuide(preferences, true);

    let fullResponse = "";
    for await (const chunk of response) {
      const content = chunk.choices[0].delta?.content || "";
      res.write(content);
      fullResponse += content;
    }

    cache[cacheKey] = fullResponse;
    setTimeout(() => delete cache[cacheKey], 3600000);

    res.end();
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);
    res.status(500).json({ error: "Error generating itinerary. Please try again later." });
  }
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
