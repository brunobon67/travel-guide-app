require("dotenv").config(); // ✅ Caricamento variabili d'ambiente

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet"); // ✅ Protezione XSS e sicurezza HTTP headers
const morgan = require("morgan"); // ✅ Logging delle richieste
const getTravelGuide = require("./chatgpt");

const app = express();

// ✅ Middleware di sicurezza e logging
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

// ✅ Servire i file statici dalla cartella "public"
app.use(express.static("public"));

// ✅ Route per la Landing Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "landing.html"));
});

// ✅ Route per la pagina principale (form di generazione itinerario)
app.get("/app", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ API Route per generare l'itinerario
app.post("/get-travel-guide", async (req, res) => {
    console.log("📩 Richiesta ricevuta:", req.body);

    const { preferences } = req.body;
    if (!preferences || !preferences.destination || !preferences.duration || !preferences.accommodation) {
        console.warn("⚠️ Campi obbligatori mancanti:", preferences);
        return res.status(400).json({ error: "Compila tutti i campi obbligatori." });
    }

    try {
        const guide = await getTravelGuide(preferences);
        res.json({ guide }); // ✅ Risposta JSON con itinerario
    } catch (error) {
        console.error("❌ Errore OpenAI:", error.message);
        res.status(500).json({ error: "Errore nel generare l'itinerario. Riprova più tardi." });
    }
});

// ✅ Gestione errori per route non trovate
app.use((req, res, next) => {
    res.status(404).json({ error: "Route non trovata" });
});

// ✅ Porta dinamica per deploy (Render, Vercel, Heroku)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
