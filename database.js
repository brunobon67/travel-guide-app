const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

let dbPath;

// ✅ On Render: try /data if it exists
if (process.env.RENDER === "true" && fs.existsSync("/data")) {
  dbPath = "/data/users.db";
} else {
  // ✅ Fallback: use local folder (create it if needed)
  const localDataDir = path.join(__dirname, "data");
  if (!fs.existsSync(localDataDir)) {
    fs.mkdirSync(localDataDir, { recursive: true });
  }
  dbPath = path.join(localDataDir, "users.db");
}

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

