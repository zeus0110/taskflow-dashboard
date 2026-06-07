import { FiCalendar, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const { title, description, dueDate, priority, completed } = task;

  // Overdue check
  const isOverdue = () => {
    if (completed) return false;
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate + 'T00:00:00');
    return taskDate < today;
  };

  const overdue = isOverdue();

  // Color config mapping by priority
  const priorityConfig = {
    low: {
      border: 'border-l-[5px] border-l-indigo-500 dark:border-l-indigo-400',
      badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/20',
    },
    medium: {
      border: 'border-l-[5px] border-l-amber-500 dark:border-l-amber-400',
      badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20',
    },
    high: {
      border: 'border-l-[5px] border-l-rose-500 dark:border-l-rose-400',
      badge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20',
    },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`glass-panel rounded-xl p-4.5 flex items-start gap-4 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm relative overflow-hidden group ${
        priorityConfig[priority]?.border
      } ${completed ? 'opacity-65' : ''}`}
    >
      {/* Glow highlight */}
      <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/4 transition duration-300 pointer-events-none" />

      {/* Completion Custom Checkbox */}
      <div className="pt-0.5 shrink-0">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 transition cursor-pointer active:scale-90 ${
            completed
              ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-600 dark:border-emerald-600'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-400'
          }`}
          aria-label={completed ? "Mark incomplete" : "Mark complete"}
        >
          {completed && (
            <motion.svg
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-3.5 h-3.5 stroke-current stroke-[3.5]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        
        {/* Title, Badge & Overdue indicator */}
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4
            className={`text-sm md:text-base font-bold tracking-tight text-zinc-800 dark:text-zinc-100 truncate flex-1 min-w-[150px] relative ${
              completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
            }`}
          >
            {title}
            {completed && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="absolute left-0 top-1/2 h-0.5 bg-zinc-400 dark:bg-zinc-500 pointer-events-none"
              />
            )}
          </h4>
          
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${priorityConfig[priority]?.badge}`}>
              {priority}
            </span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className={`text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3 break-words ${completed ? 'line-through text-zinc-400 dark:text-zinc-600' : ''}`}>
            {description}
          </p>
        )}

        {/* Bottom stats row */}
        <div className="flex items-center justify-between mt-auto pt-1 gap-2 border-t border-zinc-100/50 dark:border-zinc-800/30">
          
          {/* Due date container */}
          {dueDate ? (
            <div
              className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                overdue
                  ? 'text-rose-500 dark:text-rose-400 animate-pulse'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {overdue ? <FiAlertCircle className="w-3.5 h-3.5" /> : <FiCalendar className="w-3.5 h-3.5" />}
              <span>{overdue ? 'Overdue: ' : ''}{formatDate(dueDate)}</span>
            </div>
          ) : (
            <div className="text-[11px] font-semibold text-zinc-300 dark:text-zinc-700">
              No due date
            </div>
          )}

          {/* Action buttons (Edit, Delete) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Edit Task"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Delete Task"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
