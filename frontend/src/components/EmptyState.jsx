import { FiPlus } from 'react-icons/fi';

export default function EmptyState({ onTriggerFocus, isFiltering }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-14 glass-panel rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm max-w-md mx-auto mt-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mb-5 text-indigo-600 dark:text-indigo-400">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
        {isFiltering ? "No matching tasks" : "Your board is empty"}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-xs leading-relaxed">
        {isFiltering
          ? "We couldn't find any tasks matching your filters or search terms. Try modifying your criteria."
          : "Add your first task to jumpstart your productivity. Let's get things done!"}
      </p>

      {!isFiltering && (
        <button
          onClick={onTriggerFocus}
          className="mt-6 flex items-center gap-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-2 rounded-xl text-sm transition shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-98 cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          Create First Task
        </button>
      )}
    </div>
  );
}
