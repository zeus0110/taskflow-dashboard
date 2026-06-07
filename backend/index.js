const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const { initDB } = require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("TaskFlow API Running");
});

initDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});