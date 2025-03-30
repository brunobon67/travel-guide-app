const path = require("path");
const Database = require("better-sqlite3");

// ✅ Use /data on Render to persist users.db
const dbPath = process.env.RENDER === "true"
  ? "/data/users.db"
  : path.join(__dirname, "data", "users.db");

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
