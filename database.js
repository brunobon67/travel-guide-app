// database.js
const Database = require("better-sqlite3");
const db = new Database("users.db");

// Create users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL
  )
`).run();

module.exports = db;
