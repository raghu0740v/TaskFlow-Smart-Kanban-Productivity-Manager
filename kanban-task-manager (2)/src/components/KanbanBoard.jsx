import React from 'react';
import { COLUMNS } from '../data/initialTasks';
import KanbanColumn from './KanbanColumn';
import { SearchX } from 'lucide-react';

export default function KanbanBoard({
  filteredTasks = [],
  onOpenCreateForColumn,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onMoveStatus,
  onToggleSubtask,
  onClearFilters
}) {
  return (
    <div className="w-full overflow-x-auto pb-6 scrollbar-thin snap-x">
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center my-4 shadow-xs">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4">
            <SearchX className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">No matching tasks found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            No tasks match your current search and filter criteria. Try resetting or clearing your filters.
          </p>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-4 min-w-max pb-2">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column.id);
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onOpenCreateForColumn={onOpenCreateForColumn}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                onMoveStatus={onMoveStatus}
                onToggleSubtask={onToggleSubtask}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
