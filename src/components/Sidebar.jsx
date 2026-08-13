import React from 'react';
import {
  Kanban,
  LayoutDashboard,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function Sidebar({
  activeView,
  setActiveView,
  taskStats,
  onOpenCreateModal,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const navItems = [
    { id: 'board', label: 'Kanban Board', icon: Kanban, badge: taskStats?.total || 0 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar View', icon: CalendarIcon, badge: taskStats?.overdue > 0 ? `${taskStats.overdue} overdue` : null, badgeColor: 'bg-red-500/15 text-red-600 dark:text-red-400' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Kanban className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                  TaskFlow <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Pro</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">SaaS Task Manager</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="p-3">
          <button
            onClick={onOpenCreateModal}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-sm shadow-md shadow-indigo-500/20 transition-all active:scale-98 ${
              isCollapsed ? 'px-0' : ''
            }`}
            title="Create New Task"
          >
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span>New Task</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.badgeColor || 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Productivity Widget Summary (when expanded) */}
        {!isCollapsed && taskStats && (
          <div className="mx-3 mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/10 to-slate-100 dark:from-indigo-950/40 dark:to-slate-800/40 border border-indigo-500/10 dark:border-indigo-500/20">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Goal Progress
              </span>
              <span>{taskStats.completionPercentage}%</span>
            </div>
            <div className="mt-2 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${taskStats.completionPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{taskStats.completed} done</span>
              <span>{taskStats.total - taskStats.completed} remaining</span>
            </div>
          </div>
        )}

        {/* User Footer */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-indigo-500/20"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">Alex Rivera</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Product Lead</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
