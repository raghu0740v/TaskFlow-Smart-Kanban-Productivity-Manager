import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Plus,
  RotateCcw,
  Bell,
  Sparkles
} from 'lucide-react';

export default function Header({
  activeView,
  theme,
  setTheme,
  onOpenCreateModal,
  setMobileOpen,
  onResetData
}) {
  const titles = {
    board: { title: 'Kanban Board', sub: 'Organize, track, and reorder tasks across workflow stages.' },
    dashboard: { title: 'Project Dashboard', sub: 'High-level metrics, progress tracking, and team status overview.' },
    calendar: { title: 'Calendar Schedule', sub: 'Visualize task deadlines on an interactive date grid.' },
    analytics: { title: 'Performance Analytics', sub: 'Task distribution, priority velocity, and workload metrics.' },
    settings: { title: 'Application Settings', sub: 'Manage theme, data backups, and board preferences.' }
  };

  const current = titles[activeView] || titles.board;

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <header className="h-18 px-4 lg:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            {current.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
            {current.sub}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Reset Board quick action */}
        <button
          onClick={onResetData}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800"
          title="Reset sample task data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Notifications mock badge */}
        <button
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800 relative hidden sm:flex"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Primary New Task Header Action */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-xs lg:text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
}
