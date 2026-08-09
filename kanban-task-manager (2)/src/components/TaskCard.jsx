import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ArrowRight,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { getPriorityConfig, formatDateLabel, isTaskOverdue } from '../utils/taskUtils';
import { COLUMNS } from '../data/initialTasks';

export default function TaskCard({
  task,
  index,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onMoveStatus,
  onToggleSubtask
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOverCard, setIsDragOverCard] = useState(false);

  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isTaskOverdue(task.dueDate, task.status);

  // Subtasks completion calculation
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ taskId: task.id, sourceStatus: task.status, sourceIndex: index })
    );
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCardDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOverCard) setIsDragOverCard(true);
  };

  const handleCardDragLeave = (e) => {
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOverCard(false);
  };

  const handleCardDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCard(false);

    try {
      const dataRaw = e.dataTransfer.getData('text/plain');
      if (!dataRaw) return;
      const { taskId } = JSON.parse(dataRaw);
      if (taskId && taskId !== task.id) {
        onMoveStatus(taskId, task.status, index);
      }
    } catch (err) {
      console.error('Error reordering task card:', err);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleCardDragOver}
      onDragLeave={handleCardDragLeave}
      onDrop={handleCardDrop}
      onClick={() => onViewDetails(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            onViewDetails(task);
          }
        }
      }}
      tabIndex={0}
      role="article"
      aria-label={`Task card: ${task.title}`}
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing focus:outline-hidden focus:ring-2 focus:ring-indigo-500/60 ${
        isDragging
          ? 'opacity-40 scale-95 border-indigo-500 ring-2 ring-indigo-500/20'
          : isDragOverCard
          ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-50/20 dark:bg-indigo-950/20'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40'
      }`}
    >
      {/* Top Bar: Priority Badge + Drag Handle & Context Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${priorityConfig.bg}`}
          >
            {task.priority === 'urgent' && <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />}
            {priorityConfig.label}
          </span>

          {task.status === 'done' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 cursor-grab" title="Drag to reorder" />

          {/* Context Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-label="Open task options menu"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div
                  className="absolute right-0 top-6 z-20 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Edit Task</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (onDuplicate) onDuplicate(task.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Duplicate Task</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />

                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Move To Column
                  </div>
                  {COLUMNS.map((col) => {
                    if (col.id === task.status) return null;
                    return (
                      <button
                        key={col.id}
                        onClick={() => {
                          setShowMenu(false);
                          onMoveStatus(task.id, col.id, 0);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <span>{col.title}</span>
                        <ArrowRight className="w-3 h-3 opacity-60" />
                      </button>
                    );
                  })}

                  <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(task.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 leading-snug">
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtask Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mb-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-indigo-500" />
              <span>Subtasks</span>
            </span>
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                subtaskProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Due Date & Assignee Avatar */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {/* Due Date Indicator */}
        <div
          className={`flex items-center gap-1.5 font-medium ${
            overdue
              ? 'text-red-600 dark:text-red-400 font-semibold'
              : task.status === 'done'
              ? 'text-slate-400 dark:text-slate-500 line-through'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          title={overdue ? 'Task is overdue!' : 'Due Date'}
        >
          {overdue ? (
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          ) : (
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <span>{formatDateLabel(task.dueDate)}</span>
        </div>

        {/* Assignee Avatar */}
        {task.assignee ? (
          <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee.name}`}>
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
}
