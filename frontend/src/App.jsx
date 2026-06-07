import { useState, useEffect, useRef } from 'react';

import { ThemeProvider } from './context/ThemeContext';

import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import QuoteWidget from './components/QuoteWidget';
import RecentActivity from './components/RecentActivity';
import ConfirmationModal from './components/Modal';
import ToastContainer from './components/Toast';
import EmptyState from './components/EmptyState';

import { FiSearch } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

import API from './services/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [toasts, setToasts] = useState([]);

  const formInputRef = useRef(null);

  // ================= FETCH =================
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchTasks();
      setIsLoading(false);
    };
    init();
  }, []);

  // ================= TOAST =================
  const addToast = (msg, type = 'success') => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now().toString(), message: msg, type },
    ]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ================= ADD / EDIT =================
  const handleAddOrEditTask = async (taskData) => {
    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask.id}`, {
          ...editingTask,
          ...taskData,
        });

        addToast(`Updated task: "${taskData.title}"`, 'info');
        setEditingTask(null);
      } else {
        await API.post('/tasks', {
          ...taskData,
          completed: false,
        });

        addToast(`Created task: "${taskData.title}"`, 'success');
      }

      await fetchTasks();
    } catch (err) {
      console.error(err);
      addToast('Something went wrong!', 'error');
    }
  };

  // ================= TOGGLE (FIXED) =================
  const handleToggleTask = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updated = {
        ...task,
        completed: !task.completed,
      };

      await API.put(`/tasks/${id}`, updated);

      addToast(
        updated.completed
          ? `Completed: "${task.title}" 🎉`
          : `Reopened: "${task.title}"`,
        updated.completed ? 'success' : 'info'
      );

      await fetchTasks();
    } catch (err) {
      console.error(err);
      addToast('Unable to update task', 'error');
    }
  };

  // ================= DELETE =================
  const handleDeleteTaskConfirm = async () => {
    try {
      if (!deletingTaskId) return;

      await API.delete(`/tasks/${deletingTaskId}`);

      addToast('Task deleted', 'warning');

      setDeletingTaskId(null);
      await fetchTasks();
    } catch (err) {
      console.error(err);
      addToast('Delete failed', 'error');
    }
  };

  // ================= FILTER =================
  const filteredTasks = tasks.filter((task) => {
    const match =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!match) return false;

    if (filterTab === 'active') return !task.completed;
    if (filterTab === 'completed') return task.completed;
    if (filterTab === 'high')
      return task.priority === 'high' && !task.completed;

    return true;
  });

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="max-w-7xl mx-auto w-full p-6">
          <DashboardStats tasks={tasks} />

          {/* SEARCH */}
          <div className="flex gap-4 my-4">
            <input
              className="border p-2 w-full"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              value={filterTab}
              onChange={(e) => setFilterTab(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* TASKS */}
          {isLoading ? (
            <p>Loading...</p>
          ) : filteredTasks.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div layout>
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={setEditingTask}
                    onDelete={setDeletingTaskId}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>

        {/* MODAL */}
        <ConfirmationModal
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleDeleteTaskConfirm}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </ThemeProvider>
  );
}