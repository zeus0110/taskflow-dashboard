import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { id, message, type = 'success', duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <FiAlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <FiInfo className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white dark:bg-zinc-900 border-emerald-500/20 dark:border-emerald-500/10 shadow-emerald-500/5',
    warning: 'bg-white dark:bg-zinc-900 border-amber-500/20 dark:border-amber-500/10 shadow-amber-500/5',
    error: 'bg-white dark:bg-zinc-900 border-rose-500/20 dark:border-rose-500/10 shadow-rose-500/5',
    info: 'bg-white dark:bg-zinc-900 border-indigo-500/20 dark:border-indigo-500/10 shadow-indigo-500/5',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
      className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-xl ${bgStyles[type]} min-w-[300px] overflow-hidden`}
    >
      <div className="flex-1 flex items-start gap-3">
        {icons[type]}
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
