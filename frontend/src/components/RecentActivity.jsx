import { FiPlusCircle, FiCheckCircle, FiTrash2, FiEdit2, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecentActivity({ activities }) {
  
  const getIcon = (type) => {
    switch (type) {
      case 'create':
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/20">
            <FiPlusCircle className="w-4 h-4" />
          </div>
        );
      case 'complete':
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20">
            <FiCheckCircle className="w-4 h-4" />
          </div>
        );
      case 'delete':
        return (
          <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20">
            <FiTrash2 className="w-4 h-4" />
          </div>
        );
      case 'edit':
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20">
            <FiEdit2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500 border border-zinc-100 dark:border-zinc-800">
            <FiClock className="w-4 h-4" />
          </div>
        );
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col h-full group indigo-glow">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
      
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
        <FiClock className="w-4 h-4 text-zinc-500" />
        Recent Logs
      </h3>

      <div className="flex-1 overflow-y-auto max-h-[200px] pr-1.5 scrollbar-thin">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-6 text-zinc-400 dark:text-zinc-500">
            <p className="text-xs italic">No actions recorded yet.</p>
          </div>
        ) : (
          <div className="relative border-l border-zinc-100 dark:border-zinc-800/80 ml-3.5 pl-6 space-y-4">
            <AnimatePresence initial={false}>
              {activities.slice(0, 10).map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="relative group/item"
                >
                  {/* Timeline Dot Indicator */}
                  <div className="absolute -left-[39px] top-0 transition-transform duration-300 group-hover/item:scale-110">
                    {getIcon(activity.type)}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-tight">
                      {activity.text}
                    </p>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block mt-1">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
