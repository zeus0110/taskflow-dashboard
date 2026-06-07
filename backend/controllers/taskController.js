const { getDB } = require("../database/db");
const { v4: uuidv4 } = require("uuid");

exports.getTasks = async (req, res) => {
  try {
    const db = getDB();

    const tasks = await db.all(`
      SELECT * FROM tasks
      ORDER BY createdAt DESC
    `);

    res.json(
      tasks.map(task => ({
        ...task,
        completed: Boolean(task.completed),
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const db = getDB();

    const newTask = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    await db.run(
      `
      INSERT INTO tasks
      (id, title, description, dueDate, completed, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        newTask.id,
        newTask.title,
        newTask.description,
        newTask.dueDate,
        newTask.completed ? 1 : 0,
        newTask.createdAt,
      ]
    );

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const db = getDB();

    const task = req.body;

    await db.run(
      `
      UPDATE tasks
      SET title=?, description=?, dueDate=?, completed=?
      WHERE id=?
      `,
      [
        task.title,
        task.description,
        task.dueDate,
        task.completed ? 1 : 0,
        req.params.id,
      ]
    );

    res.json({ message: "Task updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const db = getDB();

    await db.run(
      `DELETE FROM tasks WHERE id=?`,
      [req.params.id]
    );

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};