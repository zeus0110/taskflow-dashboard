const { getDB } = require("../database/db");
const { v4: uuidv4 } = require("uuid");

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const db = getDB();

    const tasks = await db.all(
      `SELECT * FROM tasks ORDER BY createdAt DESC`
    );

    res.json(
      tasks.map((t) => ({
        ...t,
        completed: Boolean(t.completed),
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const db = getDB();

    const { title, description, dueDate, priority } = req.body;

    const task = {
      id: uuidv4(),
      title,
      description,
      dueDate,
      priority,
      completed: 0,
      createdAt: new Date().toISOString(),
    };

    await db.run(
      `INSERT INTO tasks 
      (id, title, description, dueDate, priority, completed, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description,
        task.dueDate,
        task.priority,
        task.completed,
        task.createdAt,
      ]
    );

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;

    const existing = await db.get(
      `SELECT * FROM tasks WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      dueDate,
      priority,
      completed,
    } = req.body;

    const updated = {
      title: title ?? existing.title,
      description: description ?? existing.description,
      dueDate: dueDate ?? existing.dueDate,
      priority: priority ?? existing.priority,
      completed:
        completed !== undefined
          ? completed
            ? 1
            : 0
          : existing.completed,
    };

    const result = await db.run(
      `UPDATE tasks
       SET title=?, description=?, dueDate=?, priority=?, completed=?
       WHERE id=?`,
      [
        updated.title,
        updated.description,
        updated.dueDate,
        updated.priority,
        updated.completed,
        id,
      ]
    );

    res.json({
      message: "Task updated successfully",
      changes: result.changes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const db = getDB();

    const result = await db.run(
      `DELETE FROM tasks WHERE id = ?`,
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};