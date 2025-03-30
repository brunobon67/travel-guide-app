require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const bcrypt = require("bcrypt");
const getTravelGuide = require("./chatgpt");
const db = require("./database"); // ✅ SQLite DB

const app = express();
const cache = {}; // Temporary cache for travel guides

// CORS config
const allowedOrigins = [
  "https://travel-app-guide.netlify.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": [
        "'self'",
        "https://www.gstatic.com",
        "https://www.googleapis.com"
      ],
      "connect-src": [
        "'self'",
        "https://www.googleapis.com",
        "https://firebase.googleapis.com"
      ],
      "style-src": ["'self'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
    }
  })
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 🔐 Register (uses SQLite)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  db.prepare("INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)").run(name, email, passwordHash);

  res.json({ message: "Registration successful" });
});

// 🔐 Login (uses SQLite)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.user = { name: user.name, email: user.email };
  res.json({ message: "Login successful" });
});

// 🔓 Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// 🔍 Session status
app.get("/session-status", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// 🔐 Root route
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.redirect("/app");
});

// 🔐 Protected app
app.get("/app", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve static pages
app.get("/login", (req, res) => res.redirect("/login.html"));
app.get("/register", (req, res) => res.redirect("/register.html"));

// 🌍 Travel guide generation
app.post("/get-travel-guide", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

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

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
