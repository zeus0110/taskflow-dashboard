import { FiCheckSquare, FiAlertCircle, FiClipboard, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function DashboardStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = tasks.filter(t => !t.completed).length;

  // Overdue calculation (incomplete task with due date before today)
  const isOverdue = (task) => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate + 'T00:00:00'); // append time to parse in local timezone
    return dueDate < today;
  };

  const overdue = tasks.filter(isOverdue).length;

  // Completion Percentage
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Circular progress configurations
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.35,
        ease: 'easeOut',
      },
    }),
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: total,
      icon: <FiClipboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'indigo',
      glow: 'shadow-indigo-500/5 dark:shadow-indigo-500/2',
      border: 'border-indigo-500/10 dark:border-indigo-500/5',
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      description: 'Tasks in list',
    },
    {
      title: 'Active Tasks',
      value: active,
      icon: <FiTrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'amber',
      glow: 'shadow-amber-500/5 dark:shadow-amber-500/2',
      border: 'border-amber-500/10 dark:border-amber-500/5',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      description: 'Pending completion',
    },
    {
      title: 'Completed',
      value: completed,
      icon: <FiCheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'emerald',
      glow: 'shadow-emerald-500/5 dark:shadow-emerald-500/2',
      border: 'border-emerald-500/10 dark:border-emerald-500/5',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      description: 'Successfully finished',
    },
    {
      title: 'Overdue Warnings',
      value: overdue,
      icon: <FiAlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      color: 'rose',
      glow: 'shadow-rose-500/5 dark:shadow-rose-500/2',
      border: 'border-rose-500/10 dark:border-rose-500/5',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      description: 'Missed target dates',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Outer Statistics Grid with Side Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Core Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-between border ${card.border} shadow-lg ${card.glow} relative overflow-hidden group`}
            >
              {/* Card Ambient Background Accent */}
              <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-${card.color}-500/5 group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider truncate">
                  {card.title}
                </span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
                    {card.value}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-1">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Productivity Progress Card */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="glass-panel rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg flex items-center justify-between gap-4 relative overflow-hidden group indigo-glow"
        >
          {/* Subtle line background */}
          <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full bg-indigo-500/5 blur-2xl" />
          
          <div className="flex-1">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Productivity Score
            </span>
            <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
              Overall Progress
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-tight">
              {total === 0 
                ? "No tasks active today" 
                : `${completed} of ${total} tasks completed`}
            </p>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
              {/* Background circle */}
              <circle
                className="circle-progress-bg"
                strokeWidth="6"
                fill="transparent"
                r={radius}
                cx="36"
                cy="36"
              />
              {/* Active animated circle */}
              <motion.circle
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="36"
                cy="36"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: total === 0 ? circumference : strokeDashoffset,
                }}
                animate={{ strokeDashoffset: total === 0 ? circumference : strokeDashoffset }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              {/* Define gradients */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-xs font-black text-zinc-800 dark:text-zinc-100">
              {completionPercentage}%
            </span>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
