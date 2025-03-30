const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = "/data";
const dbPath = path.join(dataDir, "users.db");

// ✅ Ensure /data exists before trying to create the DB
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// ✅ Auto-create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL
  )
`).run();

module.exports = db;
