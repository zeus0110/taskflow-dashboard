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

const defaultActivities = [
  {
    id: 'act-1',
    text: 'Welcome to TaskFlow 🚀',
    type: 'info',
    timestamp: new Date().toISOString(),
  },
];

export default function App() {

  // =========================
  // STATES
  // =========================

  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState(defaultActivities);

  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [toasts, setToasts] = useState([]);

  const formInputRef = useRef(null);

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {

      const res = await API.get('/tasks');

      setTasks(res.data);

    } catch (error) {

      console.error('Failed to fetch tasks:', error);

    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    const initializeApp = async () => {

      await fetchTasks();

      setTimeout(() => {
        setIsLoading(false);
      }, 800);

    };

    initializeApp();

  }, []);

  // =========================
  // TOAST UTILITIES
  // =========================

  const addToast = (message, type = 'success') => {

    const newToast = {
      id: Date.now().toString(),
      message,
      type,
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {

    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  };

  // =========================
  // ACTIVITY LOGGER
  // =========================

  const logActivity = (text, type) => {

    const newActivity = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date().toISOString(),
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  // =========================
  // CREATE / EDIT TASK
  // =========================

  const handleAddOrEditTask = async (taskData) => {

    try {

      if (editingTask) {

        await API.put(`/tasks/${editingTask.id}`, taskData);

        logActivity(
          `Edited task "${taskData.title}"`,
          'edit'
        );

        addToast(
          `Updated task: "${taskData.title}"`,
          'info'
        );

        setEditingTask(null);

      } else {

        await API.post('/tasks', {
          ...taskData,
          completed: false,
        });

        logActivity(
          `Created task "${taskData.title}"`,
          'create'
        );

        addToast(
          `Created task: "${taskData.title}"`,
          'success'
        );
      }

      await fetchTasks();

    } catch (error) {

      console.error('Task save failed:', error);

      addToast('Something went wrong!', 'error');
    }
  };

  // =========================
  // TOGGLE TASK
  // =========================

  const handleToggleTask = async (id) => {

    try {

      const task = tasks.find((t) => t.id === id);

      if (!task) return;

      const updatedCompleted = !task.completed;

      await API.put(`/tasks/${id}`, {
        completed: updatedCompleted,
      });

      const logMsg = updatedCompleted
        ? `Task "${task.title}" marked completed`
        : `Task "${task.title}" marked active`;

      logActivity(
        logMsg,
        updatedCompleted ? 'complete' : 'info'
      );

      addToast(
        updatedCompleted
          ? `Completed: "${task.title}" 🎉`
          : `Reopened: "${task.title}"`,
        updatedCompleted ? 'success' : 'info'
      );

      await fetchTasks();

    } catch (error) {

      console.error('Toggle failed:', error);

      addToast('Unable to update task', 'error');
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTaskConfirm = async () => {

    try {

      if (!deletingTaskId) return;

      const task = tasks.find(
        (t) => t.id === deletingTaskId
      );

      await API.delete(`/tasks/${deletingTaskId}`);

      if (task) {

        logActivity(
          `Deleted task "${task.title}"`,
          'delete'
        );

        addToast(
          `Deleted task: "${task.title}"`,
          'warning'
        );
      }

      setDeletingTaskId(null);

      await fetchTasks();

    } catch (error) {

      console.error('Delete failed:', error);

      addToast('Unable to delete task', 'error');
    }
  };

  // =========================
  // FOCUS TASK FORM
  // =========================

  const handleTriggerFocus = () => {

    if (formInputRef.current) {
      formInputRef.current.focus();
    }
  };

  // =========================
  // FILTER + SEARCH
  // =========================

  const filteredTasks = tasks.filter((task) => {

    const matchesSearch =
      task.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||

      task.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (filterTab) {

      case 'active':
        return !task.completed;

      case 'completed':
        return task.completed;

      case 'high':
        return (
          task.priority === 'high' &&
          !task.completed
        );

      default:
        return true;
    }
  });

  // =========================
  // TASK COUNTS
  // =========================

  const counts = {
    all: tasks.length,

    active: tasks.filter(
      (task) => !task.completed
    ).length,

    completed: tasks.filter(
      (task) => task.completed
    ).length,

    high: tasks.filter(
      (task) =>
        task.priority === 'high' &&
        !task.completed
    ).length,
  };

  return (
    <ThemeProvider>

      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">

        {/* HEADER */}
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col gap-6">

          {/* DASHBOARD STATS */}
          <DashboardStats tasks={tasks} />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* SIDEBAR */}
            <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">

              <TaskForm
                onSubmit={handleAddOrEditTask}
                editingTask={editingTask}
                cancelEdit={() => setEditingTask(null)}
                focusRef={formInputRef}
              />

              <QuoteWidget />

              <RecentActivity activities={activities} />

            </div>

            {/* WORKSPACE */}
            <div className="lg:col-span-2 flex flex-col gap-4 order-1 lg:order-2">

              {/* SEARCH + FILTER */}
              <div className="glass-panel rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg flex flex-col sm:flex-row gap-4 items-center justify-between relative indigo-glow">

                {/* SEARCH */}
                <div className="relative w-full sm:max-w-xs">

                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 w-4 h-4" />

                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:bg-white dark:focus:bg-zinc-950 input-focus transition"
                  />

                </div>

                {/* FILTERS */}
                <div className="flex p-1 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-x-auto w-full sm:w-auto scrollbar-none gap-0.5">

                  {['all', 'active', 'completed', 'high'].map((tab) => (

                    <button
                      key={tab}
                      onClick={() => setFilterTab(tab)}
                      className={`relative px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition shrink-0 cursor-pointer ${
                        filterTab === tab
                          ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/50 dark:border-zinc-800/60 shadow-sm'
                          : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                      }`}
                    >

                      <span className="flex items-center gap-1.5">

                        {tab === 'high'
                          ? 'High Priority'
                          : tab}

                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                            filterTab === tab
                              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                              : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500'
                          }`}
                        >

                          {counts[tab]}

                        </span>

                      </span>

                    </button>
                  ))}

                </div>

              </div>

              {/* TASK WORKSPACE */}
              <div className="flex-1 flex flex-col gap-4">

                {isLoading ? (

                  <div className="space-y-4">

                    {[1, 2, 3].map((n) => (

                      <div
                        key={n}
                        className="glass-panel border border-zinc-200/40 dark:border-zinc-800/40 rounded-2xl p-5 animate-pulse flex items-start gap-4"
                      >

                        <div className="w-5.5 h-5.5 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />

                        <div className="flex-1 space-y-3">

                          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />

                          <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-2/3" />

                          <div className="h-3.5 bg-zinc-100 dark:bg-zinc-900 rounded w-1/3 mt-2" />

                        </div>

                      </div>
                    ))}

                  </div>

                ) : filteredTasks.length === 0 ? (

                  <EmptyState
                    onTriggerFocus={handleTriggerFocus}
                    isFiltering={tasks.length > 0}
                  />

                ) : (

                  <motion.div
                    layout
                    className="flex flex-col gap-3.5"
                  >

                    <AnimatePresence mode="popLayout">

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

              </div>

            </div>

          </div>

        </main>

        {/* DELETE MODAL */}
        <ConfirmationModal
          isOpen={deletingTaskId !== null}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleDeleteTaskConfirm}
          title="Delete this task?"
          message="This action cannot be undone. This task will be permanently removed from your dashboard database."
          confirmText="Yes, delete"
          cancelText="Keep task"
        />

        {/* TOASTS */}
        <ToastContainer
          toasts={toasts}
          removeToast={removeToast}
        />

      </div>

    </ThemeProvider>
  );
}