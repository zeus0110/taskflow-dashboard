import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import QuoteWidget from "./components/QuoteWidget";
import RecentActivity from "./components/RecentActivity";
import ConfirmationModal from "./components/Modal";
import ToastContainer from "./components/Toast";
import EmptyState from "./components/EmptyState";
import API from "./services/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const formInputRef = useRef(null);

  const addToast = (message, type = "success") => {
    setToasts((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        type
      }
    ]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addActivity = (type, text) => {
    setActivities((prev) =>
      [
        {
          id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
          type,
          text,
          timestamp: new Date().toISOString()
        },
        ...prev
      ].slice(0, 10)
    );
  };

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchTasks();
      } catch (err) {
        console.error("Fetch error:", err);
        addToast("Backend is not running. Start the server on port 5000.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleAddOrEditTask = async (taskData) => {
    try {
      if (editingTask) {
        const res = await API.put(`/tasks/${editingTask.id}`, {
          ...editingTask,
          ...taskData
        });

        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? res.data : task))
        );

        addToast(`Updated task: "${res.data.title}"`, "info");
        addActivity("edit", `Updated "${res.data.title}"`);
        setEditingTask(null);
      } else {
        const res = await API.post("/tasks", taskData);

        setTasks((prev) => [res.data, ...prev]);

        addToast(`Created task: "${res.data.title}"`, "success");
        addActivity("create", `Created "${res.data.title}"`);
      }
    } catch (err) {
      console.error("Save error:", err);
      addToast(err.response?.data?.message || "Unable to save task", "error");
    }
  };

  const handleToggleTask = async (id) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    try {
      const res = await API.put(`/tasks/${id}`, {
        ...task,
        completed: !task.completed
      });

      setTasks((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );

      addToast(
        res.data.completed
          ? `Completed: "${task.title}"`
          : `Reopened: "${task.title}"`,
        res.data.completed ? "success" : "info"
      );

      addActivity(
        res.data.completed ? "complete" : "edit",
        `${res.data.completed ? "Completed" : "Reopened"} "${task.title}"`
      );
    } catch (err) {
      console.error("Toggle error:", err);
      addToast("Unable to update task", "error");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTimeout(() => formInputRef.current?.focus(), 0);
  };

  const handleDeleteTaskConfirm = async () => {
    if (!deletingTaskId) return;

    const task = tasks.find((item) => item.id === deletingTaskId);

    try {
      await API.delete(`/tasks/${deletingTaskId}`);

      setTasks((prev) => prev.filter((item) => item.id !== deletingTaskId));

      addToast("Task deleted", "warning");
      addActivity("delete", `Deleted "${task?.title || "task"}"`);
      setDeletingTaskId(null);
    } catch (err) {
      console.error("Delete error:", err);
      addToast("Delete failed", "error");
    }
  };

  const counters = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
      high: tasks.filter(
        (task) => task.priority === "high" && !task.completed
      ).length
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (filterTab === "active") return !task.completed;
      if (filterTab === "completed") return task.completed;
      if (filterTab === "high") {
        return task.priority === "high" && !task.completed;
      }

      return true;
    });
  }, [tasks, searchQuery, filterTab]);

  const tabs = [
    ["all", "All"],
    ["active", "Active"],
    ["completed", "Completed"],
    ["high", "High Priority"]
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Header />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <DashboardStats tasks={tasks} />

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
            <aside className="space-y-6">
              <TaskForm
                onSubmit={handleAddOrEditTask}
                editingTask={editingTask}
                cancelEdit={() => setEditingTask(null)}
                focusRef={formInputRef}
              />

              <QuoteWidget />
              <RecentActivity activities={activities} />
            </aside>

            <section className="space-y-4">
              <div className="glass-panel rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
                <div className="relative flex-1 max-w-xl">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                  <input
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/60 text-sm font-medium placeholder-zinc-400 input-focus"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 sm:flex gap-2 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60">
                  {tabs.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilterTab(value)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                        filterTab === value
                          ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      {label}

                      <span className="ml-2 px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-[10px]">
                        {counters[value]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="glass-panel rounded-2xl p-10 text-center text-zinc-500">
                  Loading tasks...
                </div>
              ) : filteredTasks.length === 0 ? (
                <EmptyState
                  isFiltering={Boolean(searchQuery || filterTab !== "all")}
                  onTriggerFocus={() => formInputRef.current?.focus()}
                />
              ) : (
                <motion.div layout className="space-y-4">
                  <AnimatePresence initial={false}>
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onEdit={handleEditTask}
                        onDelete={setDeletingTaskId}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </section>
          </div>
        </main>

        <ConfirmationModal
          isOpen={Boolean(deletingTaskId)}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleDeleteTaskConfirm}
          title="Delete this task?"
          message="This action cannot be undone."
          confirmText="Delete"
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </ThemeProvider>
  );
}