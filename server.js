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

const app = express();

// In-memory cache and user store (for development only)
const cache = {};
let users = [
  {
    name: "Demo User",
    email: "test@example.com",
    passwordHash: "$2b$10$HD5R5GtVw8vWzQUgdgCGxO7jw1XEo71mFkfUP7eOXD9CnApWFXpEy" // password: 123456
  }
];

// CORS configuration for frontend
const allowedOrigins = [
  "https://travel-app-guide.netlify.app", // Production frontend
  "http://localhost:3000"                 // Local frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("public"));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true with HTTPS
}));

// 🔐 Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ name, email, passwordHash });

  req.session.user = { name, email };
  res.json({ message: "Registration successful" });
});

// 🔐 Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.user = { name: user.name, email: user.email };
  res.json({ message: "Login successful" });
});

// 🔓 Logout route
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

// 🏠 Landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "landing.html"));
});

// 🔐 Login and main app pages
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🌍 Protected travel guide generation
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

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
