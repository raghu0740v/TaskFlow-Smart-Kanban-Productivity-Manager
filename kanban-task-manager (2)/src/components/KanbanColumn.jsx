import React, { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import TaskCard from './TaskCard';

export default function KanbanColumn({
  column,
  tasks = [],
  onOpenCreateForColumn,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onMoveStatus,
  onToggleSubtask
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const columnColorMap = {
    slate: 'bg-slate-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500'
  };

  const badgeBgMap = {
    slate: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
  };

  // Drag over drop handlers for empty column or column backdrop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dataRaw = e.dataTransfer.getData('text/plain');
      if (!dataRaw) return;
      const { taskId } = JSON.parse(dataRaw);
      if (taskId) {
        onMoveStatus(taskId, column.id, tasks.length);
      }
    } catch (error) {
      console.error('Error handling task drop:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col min-w-[280px] w-80 max-w-[340px] shrink-0 bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl border transition-all duration-200 snap-center ${
        isDragOver
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5'
          : 'border-slate-200/80 dark:border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${columnColorMap[column.color] || 'bg-indigo-500'}`} />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            {column.title}
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${badgeBgMap[column.color]}`}>
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onOpenCreateForColumn(column.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
          title={`Add task to ${column.title}`}
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Content - Cards list */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[300px] max-h-[calc(100vh-230px)] scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 my-2">
            <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">No tasks in {column.title}</p>
            <button
              onClick={() => onOpenCreateForColumn(column.id)}
              className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add a task
            </button>
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onMoveStatus={onMoveStatus}
              onToggleSubtask={onToggleSubtask}
            />
          ))
        )}
      </div>
    </div>
  );
}
