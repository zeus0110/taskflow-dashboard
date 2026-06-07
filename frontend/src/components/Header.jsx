import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiLayers } from 'react-icons/fi';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <FiLayers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white leading-none my-0">
                TaskFlow
              </h1>
              <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/40">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5 hidden sm:block">
              Simplify your workflow, accelerate output.
            </p>
          </div>
        </div>

        {/* Right Navigation & Settings */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/30 dark:border-indigo-900/20"
            >
              Dashboard
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
              Docs
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
              Source
            </a>
          </nav>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm cursor-pointer transition active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <FiMoon className="w-4 h-4" />
            ) : (
              <FiSun className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
