import React from 'react';
import {
  Search,
  Filter,
  X,
  ArrowUpDown,
  Tag,
  User,
  AlertCircle,
  Columns
} from 'lucide-react';
import { SAMPLE_ASSIGNEES, COLUMNS, PRIORITIES, AVAILABLE_TAGS } from '../data/initialTasks';

export default function FilterBar({ filters, setFilters, onClearFilters }) {
  const {
    search = '',
    priority = 'all',
    status = 'all',
    assignee = 'all',
    tag = 'all',
    sortBy = 'default'
  } = filters;

  // Count active filters
  const activeCount = [
    search ? 1 : 0,
    priority !== 'all' ? 1 : 0,
    status !== 'all' ? 1 : 0,
    assignee !== 'all' ? 1 : 0,
    tag !== 'all' ? 1 : 0,
    sortBy !== 'default' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleSelectChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 mb-6 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search tasks by title, description, or tag..."
            className="w-full pl-9 pr-14 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
          {search ? (
            <button
              onClick={() => handleSelectChange('search', '')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 border border-slate-300/60 dark:border-slate-600/60 rounded absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Dropdown Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <div className="relative flex items-center">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={priority}
              onChange={(e) => handleSelectChange('priority', e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} Priority
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative flex items-center">
            <Columns className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={status}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
            >
              <option value="all">All Columns</option>
              {COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="relative flex items-center">
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={assignee}
              onChange={(e) => handleSelectChange('assignee', e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
            >
              <option value="all">All Assignees</option>
              {SAMPLE_ASSIGNEES.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          {/* Tag Filter */}
          <div className="relative flex items-center">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={tag}
              onChange={(e) => handleSelectChange('tag', e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
            >
              <option value="all">All Tags</option>
              {AVAILABLE_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => handleSelectChange('sortBy', e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
            >
              <option value="default">Default Order</option>
              <option value="dueDateAsc">Due Date (Earliest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
              <option value="priorityHighToLow">Priority (High → Low)</option>
              <option value="priorityLowToHigh">Priority (Low → High)</option>
              <option value="titleAsc">Title (A-Z)</option>
              <option value="createdAtDesc">Newest Created</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {activeCount > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear ({activeCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
