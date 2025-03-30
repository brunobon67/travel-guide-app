const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbFolder = path.join(__dirname, "data");
const dbPath = path.join(dbFolder, "users.db");

// ✅ Make sure 'data/' folder exists
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
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



