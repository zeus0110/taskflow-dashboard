const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.join(__dirname, "../data/tasks.json");

const readTasks = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

exports.getTasks = (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
};

exports.createTask = (req, res) => {
  const tasks = readTasks();

  const newTask = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date(),
  };

  tasks.unshift(newTask);

  writeTasks(tasks);

  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  const tasks = readTasks();

  const updatedTasks = tasks.map((task) =>
    task.id === req.params.id
      ? { ...task, ...req.body }
      : task
  );

  writeTasks(updatedTasks);

  res.json({ message: "Task updated" });
};

exports.deleteTask = (req, res) => {
  const tasks = readTasks();

  const filteredTasks = tasks.filter(
    (task) => task.id !== req.params.id
  );

  writeTasks(filteredTasks);

  res.json({ message: "Task deleted" });
};