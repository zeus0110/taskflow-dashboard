const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

async function initDB() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }

  console.log("JSON task store ready");
}

async function readTasks() {
  await initDB();

  const raw = await fs.readFile(DATA_FILE, "utf8");

  try {
    const tasks = JSON.parse(raw);
    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

module.exports = {
  initDB,
  readTasks,
  writeTasks,
  randomUUID
};