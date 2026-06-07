const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

async function initDB() {
  db = await open({
    filename: "./database/tasks.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      completed INTEGER DEFAULT 0,
      createdAt TEXT
    )
  `);

  console.log("SQLite connected");
}

function getDB() {
  return db;
}

module.exports = { initDB, getDB };