import React, { useEffect } from 'react';
import {
  X,
  Edit2,
  Copy,
  Trash2,
  Calendar,
  Clock,
  User,
  CheckSquare,
  AlertCircle,
  Tag,
  Kanban
} from 'lucide-react';
import { getPriorityConfig, formatDateLabel, isTaskOverdue } from '../utils/taskUtils';
import { COLUMNS } from '../data/initialTasks';

export default function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onMoveStatus,
  onToggleSubtask
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isTaskOverdue(task.dueDate, task.status);

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const hoursProgress = task.estimatedHours > 0 ? Math.min(100, Math.round((task.loggedHours / task.estimatedHours) * 100)) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-heading"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${priorityConfig.bg}`}
            >
              {priorityConfig.label} Priority
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {COLUMNS.find((c) => c.id === task.status)?.title || task.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Task"
              aria-label="Edit task"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                if (onDuplicate) onDuplicate(task.id);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Duplicate Task"
              aria-label="Duplicate task"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(task.id);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete Task"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              aria-label="Close task details modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2 id="task-details-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {task.title}
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {task.description || 'No detailed description provided for this task.'}
            </p>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assignee Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              {task.assignee ? (
                <>
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assignee</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{task.assignee.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{task.assignee.role}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <User className="w-5 h-5" />
                  <span>Unassigned</span>
                </div>
              )}
            </div>

            {/* Due Date Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${overdue ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Due Date</p>
                <p className={`text-sm font-bold ${overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {formatDateLabel(task.dueDate)} {overdue && '(Overdue)'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{task.dueDate || 'No target date'}</p>
              </div>
            </div>
          </div>

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-500" /> Subtask Checklist ({completedSubtasks}/{totalSubtasks})
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{subtaskProgress}%</span>
              </div>

              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>

              <div className="space-y-2">
                {task.subtasks.map((st) => (
                  <label
                    key={st.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => onToggleSubtask(task.id, st.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}>
                      {st.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Time Logging Tracking */}
          {(task.estimatedHours > 0 || task.loggedHours > 0) && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" /> Time Tracked
                </span>
                <span>
                  {task.loggedHours} / {task.estimatedHours} hrs ({hoursProgress}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${hoursProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Column Transition Bar */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Move Column</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {COLUMNS.map((col) => {
                const isCurrent = col.id === task.status;
                return (
                  <button
                    key={col.id}
                    disabled={isCurrent}
                    onClick={() => {
                      onMoveStatus(task.id, col.id, 0);
                      onClose();
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {col.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
