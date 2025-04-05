const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(morgan("dev"));

// ✅ CSP: allow Firebase + Google Fonts
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "https://www.gstatic.com",
        "https://www.googleapis.com",
        "https://www.gstatic.com/firebasejs",
        "https://apis.google.com"
      ],
      "connect-src": [
        "'self'",
        "https://securetoken.googleapis.com",
        "https://identitytoolkit.googleapis.com",
        "https://firebase.googleapis.com",
        "https://firestore.googleapis.com"
      ],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      "font-src": ["'self'", "https://fonts.gstatic.com"]
    }
  })
);

// ✅ Routes
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/app", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(__dirname, "public", "profile.html")));
app.get("/saved-plans", (req, res) => res.sendFile(path.join(__dirname, "public", "saved-plans.html")));

const getTravelGuide = require("./chatgpt");

app.post("/get-travel-guide", async (req, res) => {
  const { preferences } = req.body;

if (
  !preferences ||
  !preferences.destination ||
  !preferences.duration ||
  !preferences.preferredActivities ||
  !preferences.nightlife
) {
  return res.status(400).json({ error: "Please fill in all required fields." });
}


  try {
    const response = await getTravelGuide(preferences);
    res.json({ guide: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message);
    res.status(500).json({ error: "Error generating itinerary. Please try again later." });
  }
});

// ✅ Fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

