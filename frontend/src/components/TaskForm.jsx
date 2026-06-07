import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

export default function TaskForm({ onSubmit, editingTask, cancelEdit, focusRef }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium'); // low, medium, high
  const [dateWarning, setDateWarning] = useState(false);

  // Synchronise state if we are in editing mode
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority || 'medium');
    } else {
      resetForm();
    }
  }, [editingTask]);

  // Validate chosen due date (warning if past)
  useEffect(() => {
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(dueDate + 'T00:00:00');
      if (selected < today) {
        setDateWarning(true);
      } else {
        setDateWarning(false);
      }
    } else {
      setDateWarning(false);
    }
  }, [dueDate]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setDateWarning(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
    });
    
    if (!editingTask) {
      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-2xl p-5 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg relative flex flex-col gap-4 group indigo-glow"
    >
      <div className="absolute -left-10 -top-10 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
        {editingTask ? 'Edit Task Info' : 'Create New Task'}
      </h3>

      {/* Title input with character count */}
      <div className="flex flex-col gap-1.5 relative">
        <label htmlFor="task-title" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="task-title"
            ref={focusRef}
            type="text"
            required
            maxLength={60}
            placeholder="e.g. Design app homepage mockups"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:bg-white dark:focus:bg-zinc-950 input-focus transition"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 dark:text-zinc-600">
            {title.length}/60
          </span>
        </div>
      </div>

      {/* Description textarea */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-description" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Description
        </label>
        <textarea
          id="task-description"
          maxLength={200}
          rows={3}
          placeholder="Brief description of the goals..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:bg-white dark:focus:bg-zinc-950 input-focus transition resize-none"
        />
      </div>

      {/* Due Date & Priority Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Due Date picker */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-duedate" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Due Date
          </label>
          <input
            id="task-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-950 input-focus transition"
          />
          {dateWarning && (
            <span className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold mt-1">
              <FiAlertTriangle className="shrink-0" /> Selected date is in the past!
            </span>
          )}
        </div>

        {/* Priority segment controller */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Priority Level
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40">
            {['low', 'medium', 'high'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`py-1.5 px-2.5 text-xs font-bold rounded-lg capitalize transition cursor-pointer ${
                  priority === p
                    ? p === 'low'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/55 dark:border-indigo-800/40 shadow-sm'
                      : p === 'medium'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/55 dark:border-amber-800/40 shadow-sm'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/55 dark:border-rose-800/40 shadow-sm'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 mt-2 justify-end">
        {editingTask && (
          <button
            type="button"
            onClick={cancelEdit}
            className="flex items-center gap-1 px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs rounded-xl cursor-pointer transition active:scale-97"
          >
            <FiX className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-97"
        >
          {editingTask ? (
            <>
              <FiCheck className="w-3.5 h-3.5" />
              Save Edits
            </>
          ) : (
            <>
              <FiPlus className="w-3.5 h-3.5" />
              Add Task
            </>
          )}
        </button>
      </div>

    </form>
  );
}
