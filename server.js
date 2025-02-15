require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet"); // ✅ Security headers
const morgan = require("morgan"); // ✅ Request logging
const getTravelGuide = require("./chatgpt");

const app = express();

// ✅ Correct CORS Configuration to Allow Requests from Netlify
const allowedOrigins = [
    "https://travel-app-guide.netlify.app, //
    "http://localhost:3000" // ✅ Allow local development
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// ✅ Security Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

// ✅ Serve Static Files
app.use(express.static("public"));

// ✅ Landing Page Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "landing.html"));
});

// ✅ Main App Page (Itinerary Form)
app.get("/app", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ API Route to Generate Travel Guide
app.post("/get-travel-guide", async (req, res) => {
    console.log("📩 Received Request:", req.body);

    const { preferences } = req.body;
    if (!preferences || !preferences.destination || !preferences.duration || !preferences.accommodation) {
        console.warn("⚠️ Missing Required Fields:", preferences);
        return res.status(400).json({ error: "Please fill in all required fields." });
    }

    try {
        const guide = await getTravelGuide(preferences);
        res.json({ guide }); // ✅ Return itinerary as JSON
    } catch (error) {
        console.error("❌ OpenAI API Error:", error.message);
        res.status(500).json({ error: "Error generating itinerary. Please try again later." });
    }
});

// ✅ Handle 404 Errors for Undefined Routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// ✅ Dynamic Port for Deployment (Render, Vercel, Heroku)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
