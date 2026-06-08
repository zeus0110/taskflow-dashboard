const { readTasks, writeTasks, randomUUID } = require("../database/db");

const normaliseTask = (task) => ({
  ...task,
  completed: Boolean(task.completed),
  priority: task.priority || "medium",
  description: task.description || "",
  dueDate: task.dueDate || ""
});

exports.getTasks = async (req, res) => {
  try {
    const tasks = await readTasks();

    const sortedTasks = tasks
      .map(normaliseTask)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json(sortedTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description = "",
      dueDate = "",
      priority = "medium"
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = {
      id: randomUUID(),
      title: title.trim(),
      description: String(description || "").trim(),
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const tasks = await readTasks();
    tasks.push(task);
    await writeTasks(tasks);

    res.status(201).json(normaliseTask(task));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const tasks = await readTasks();
    const index = tasks.findIndex((task) => task.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existing = tasks[index];

    const updated = {
      ...existing,
      title:
        req.body.title !== undefined
          ? String(req.body.title).trim()
          : existing.title,
      description:
        req.body.description !== undefined
          ? String(req.body.description || "").trim()
          : existing.description,
      dueDate:
        req.body.dueDate !== undefined
          ? req.body.dueDate
          : existing.dueDate,
      priority:
        req.body.priority !== undefined
          ? req.body.priority
          : existing.priority,
      completed:
        req.body.completed !== undefined
          ? Boolean(req.body.completed)
          : Boolean(existing.completed),
      updatedAt: new Date().toISOString()
    };

    if (!updated.title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    tasks[index] = updated;
    await writeTasks(tasks);

    res.json(normaliseTask(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const tasks = await readTasks();
    const filteredTasks = tasks.filter((task) => task.id !== req.params.id);

    if (filteredTasks.length === tasks.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    await writeTasks(filteredTasks);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};