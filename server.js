const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Middleware
app.use(express.json());
app.use(morgan("dev"));

// ✅ Security headers including Firebase compatibility
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

// ✅ Route: login and register pages
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));

// ✅ Route: main app (no session check — Firebase Auth handles auth)
app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Profile and Saved Plans (if needed)
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

app.get("/saved-plans", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "saved-plans.html"));
});

const getTravelGuide = require("./chatgpt"); // Make sure you have this at the top

// 🌍 Travel guide generator
app.post("/get-travel-guide", async (req, res) => {
  const { preferences } = req.body;

  if (
    !preferences ||
    !preferences.destination ||
    !preferences.duration ||
    !preferences.accommodation
  ) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  try {
    // Optional: if you want to stream (like SSE), you can extend this
    const response = await getTravelGuide(preferences);
res.json({ guide: response.choices[0].message.content });

  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);
    res.status(500).json({ error: "Error generating itinerary. Please try again later." });
  }
});



// ✅ Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

