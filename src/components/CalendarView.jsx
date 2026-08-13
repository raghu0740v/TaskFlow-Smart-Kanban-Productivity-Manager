import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { getPriorityConfig, isTaskOverdue } from '../utils/taskUtils';

export default function CalendarView({ tasks = [], onViewDetails, onOpenCreateForDate }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Efficient date-to-tasks map using useMemo
  const tasksByDate = React.useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (task.dueDate) {
        if (!map[task.dueDate]) {
          map[task.dueDate] = [];
        }
        map[task.dueDate].push(task);
      }
    });
    return map;
  }, [tasks]);

  // Memoized grid calculation
  const calendarCells = React.useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Previous month trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      cells.push({
        dateStr: `${y}-${m}-${d}`,
        dayNum,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      cells.push({
        dateStr: `${year}-${monthStr}-${dayStr}`,
        dayNum: day,
        isCurrentMonth: true
      });
    }

    // Next month leading days
    const remainingCells = 35 - cells.length;
    if (remainingCells > 0) {
      for (let day = 1; day <= remainingCells; day++) {
        const nextDate = new Date(year, month + 1, day);
        const y = nextDate.getFullYear();
        const m = String(nextDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        cells.push({
          dateStr: `${y}-${m}-${d}`,
          dayNum: day,
          isCurrentMonth: false
        });
      }
    }

    return cells;
  }, [year, month]);

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs animate-in fade-in duration-200">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Task deadlines mapped by due date</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800/80 rounded-t-xl overflow-hidden mb-px">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-slate-50 dark:bg-slate-900 py-2.5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Month Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800/80 rounded-b-xl overflow-hidden">
        {calendarCells.map((cell, index) => {
          const dayTasks = tasksByDate[cell.dateStr] || [];
          const isToday = cell.dateStr === todayStr;

          return (
            <div
              key={`${cell.dateStr}-${index}`}
              className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                cell.isCurrentMonth
                  ? 'bg-white dark:bg-slate-900'
                  : 'bg-slate-50/60 dark:bg-slate-950/40 text-slate-400'
              } ${isToday ? 'ring-2 ring-indigo-500 ring-inset z-10' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : cell.isCurrentMonth
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400'
                  }`}
                >
                  {cell.dayNum}
                </span>

                <button
                  onClick={() => onOpenCreateForDate(cell.dateStr)}
                  className="p-1 rounded opacity-0 hover:opacity-100 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
                  title={`Add task for ${cell.dateStr}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Task Chips for Date */}
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[75px] scrollbar-none">
                {dayTasks.map((task) => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  const overdue = isTaskOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onViewDetails(task)}
                      className={`px-1.5 py-1 rounded-lg text-[11px] font-semibold truncate cursor-pointer transition-all border ${
                        overdue
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                          : task.status === 'done'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 line-through'
                          : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20'
                      }`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
