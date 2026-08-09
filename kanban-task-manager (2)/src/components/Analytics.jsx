import React from 'react';
import {
  PieChart,
  BarChart,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { COLUMNS, PRIORITIES, SAMPLE_ASSIGNEES } from '../data/initialTasks';

export default function Analytics({ stats, tasks = [] }) {
  // Assignee Workload calculation
  const assigneeWorkload = SAMPLE_ASSIGNEES.map((user) => {
    const userTasks = tasks.filter((t) => t.assignee?.id === user.id);
    const completed = userTasks.filter((t) => t.status === 'done').length;
    const hours = userTasks.reduce((sum, t) => sum + (t.loggedHours || 0), 0);
    return {
      user,
      totalTasks: userTasks.length,
      completed,
      hours
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Summary */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-300">Productivity Intelligence</span>
            <h2 className="text-2xl font-extrabold mt-1">SaaS Kanban Performance Metrics</h2>
            <p className="text-sm text-indigo-200 mt-1 max-w-xl">
              Real-time analytics on velocity, workload distribution, time logging, and deliverable completion rates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <div className="text-2xl font-extrabold text-emerald-400">{stats.completionPercentage}%</div>
              <div className="text-[11px] font-medium text-indigo-200 uppercase">Velocity Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
              <div className="text-2xl font-extrabold text-amber-300">{stats.totalLoggedHours}h</div>
              <div className="text-[11px] font-medium text-indigo-200 uppercase">Hours Logged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Column Stage Distribution & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Bar Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tasks per Kanban Stage</h3>
            </div>
            <span className="text-xs text-slate-500">{stats.total} total tasks</span>
          </div>

          <div className="space-y-4">
            {COLUMNS.map((col) => {
              const count = stats.statusCounts[col.id] || 0;
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

              const barColors = {
                backlog: 'bg-slate-400',
                todo: 'bg-blue-500',
                'in-progress': 'bg-amber-500',
                review: 'bg-purple-500',
                done: 'bg-emerald-500'
              };

              return (
                <div key={col.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{col.title}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {count} tasks ({percentage}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColors[col.id] || 'bg-indigo-500'} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Priority Level Breakdown</h3>
            </div>
            <span className="text-xs text-slate-500">Task risk distribution</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {PRIORITIES.map((p) => {
              const count = stats.priorityCounts[p.id] || 0;
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${p.bg}`}>
                      {p.label}
                    </span>
                    <span className="text-xs text-slate-400">{percentage}%</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{count}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">tasks assigned</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Workload Distribution Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Team Member Workload Distribution</h3>
          </div>
          <span className="text-xs text-slate-500">Active team capacity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {assigneeWorkload.map(({ user, totalTasks, completed, hours }) => {
            const completionPct = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

            return (
              <div
                key={user.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20 mb-3"
                />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{user.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-3">{user.role}</p>

                <div className="w-full pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Tasks:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{totalTasks}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Completed:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{completed} ({completionPct}%)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Hours:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{hours}h</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
