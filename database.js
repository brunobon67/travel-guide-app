const path = require("path");
const Database = require("better-sqlite3");

const isRender = process.env.RENDER === "true";
const dbPath = isRender
  ? "/data/users.db"                       // ✅ Render persistent path
  : path.join(__dirname, "data/users.db"); // ✅ Local fallback

const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL
  )
`).run();

module.exports = db;


