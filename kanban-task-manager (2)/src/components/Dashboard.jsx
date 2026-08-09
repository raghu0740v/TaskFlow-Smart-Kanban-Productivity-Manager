import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  BarChart2,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  CheckSquare,
  Plus
} from 'lucide-react';
import { COLUMNS, PRIORITIES } from '../data/initialTasks';

export default function Dashboard({
  stats,
  tasks = [],
  onOpenCreateModal,
  onViewDetails,
  setActiveView
}) {
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');
  const overdueTasks = tasks.filter((t) => t.status !== 'done' && t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats.total}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">tasks across board</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Active project workflow</span>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats.completionPercentage}%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ({stats.completed} / {stats.total} done)
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats.inProgress}</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">active sprint</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {stats.review} tasks waiting for code review
          </p>
        </div>

        {/* Overdue Alert Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className={`p-2.5 rounded-xl ${stats.overdue > 0 ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${stats.overdue > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {stats.overdue}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">need attention</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {stats.highOrUrgent} high/urgent priority items
          </p>
        </div>
      </div>

      {/* Main Grid: Status Breakdown + Priority Focus List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Status Distribution & Hours */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Stage Breakdown Card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Workflow Column Breakdown</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of tasks across Kanban stages</p>
              </div>
              <button
                onClick={() => setActiveView('board')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>View Board</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Custom Horizontal Stack Bar Chart */}
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex my-4 shadow-inner">
              {COLUMNS.map((col) => {
                const count = stats.statusCounts[col.id] || 0;
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                if (pct === 0) return null;

                const colBgMap = {
                  backlog: 'bg-slate-400',
                  todo: 'bg-blue-500',
                  'in-progress': 'bg-amber-500',
                  review: 'bg-purple-500',
                  done: 'bg-emerald-500'
                };

                return (
                  <div
                    key={col.id}
                    title={`${col.title}: ${count} tasks (${Math.round(pct)}%)`}
                    style={{ width: `${pct}%` }}
                    className={`h-full ${colBgMap[col.id] || 'bg-indigo-500'} transition-all duration-300 hover:brightness-110`}
                  />
                );
              })}
            </div>

            {/* Legend Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              {COLUMNS.map((col) => {
                const count = stats.statusCounts[col.id] || 0;
                const dotMap = {
                  backlog: 'bg-slate-400',
                  todo: 'bg-blue-500',
                  'in-progress': 'bg-amber-500',
                  review: 'bg-purple-500',
                  done: 'bg-emerald-500'
                };

                return (
                  <div key={col.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className={`w-2 h-2 rounded-full ${dotMap[col.id]}`} />
                      <span className="truncate">{col.title}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time & Subtask Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Estimated vs Logged</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hours spent on task execution</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalLoggedHours}h</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">of {stats.totalEstimatedHours}h estimated</span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Subtasks Progress</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Individual deliverable items</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.completedSubtasks}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">of {stats.totalSubtasks} subtasks completed ({stats.subtaskPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High Priority Watchlist */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Priority Focus</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-500/10 text-red-600 dark:text-red-400">
              {urgentTasks.length} items
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] pr-1">
            {urgentTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No high or urgent tasks pending!
              </div>
            ) : (
              urgentTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onViewDetails(t)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'urgent'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      {t.priority.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400">{t.dueDate || 'No date'}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                    {t.title}
                  </h4>

                  {t.assignee && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      <img src={t.assignee.avatar} alt="" className="w-4 h-4 rounded-full" />
                      <span>{t.assignee.name}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <button
            onClick={onOpenCreateModal}
            className="mt-4 w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Priority Task
          </button>
        </div>
      </div>
    </div>
  );
}
