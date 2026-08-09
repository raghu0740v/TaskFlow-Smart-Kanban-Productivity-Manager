import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  User,
  CheckSquare,
  Tag
} from 'lucide-react';
import { SAMPLE_ASSIGNEES, COLUMNS, PRIORITIES, AVAILABLE_TAGS } from '../data/initialTasks';

export default function TaskModal({
  isOpen,
  initialData,
  defaultStatus = 'todo',
  onSave,
  onClose
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [loggedHours, setLoggedHours] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || defaultStatus);
      setPriority(initialData.priority || 'medium');
      setDueDate(initialData.dueDate || new Date().toISOString().slice(0, 10));
      setAssigneeId(initialData.assignee?.id || SAMPLE_ASSIGNEES[0].id);
      setTags(initialData.tags || ['Frontend']);
      setEstimatedHours(initialData.estimatedHours !== undefined ? String(initialData.estimatedHours) : '8');
      setLoggedHours(initialData.loggedHours !== undefined ? String(initialData.loggedHours) : '0');
      setSubtasks(initialData.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setDueDate(new Date().toISOString().slice(0, 10));
      setAssigneeId(SAMPLE_ASSIGNEES[0].id);
      setTags(['Frontend']);
      setEstimatedHours('8');
      setLoggedHours('0');
      setSubtasks([]);
    }
    setErrors({});
    setIsSubmitting(false);
  }, [initialData, defaultStatus, isOpen]);

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Add tag
  const handleAddTag = (tagToAdd) => {
    const cleanTag = tagToAdd.trim();
    if (cleanTag && !tags.includes(cleanTag) && cleanTag.length <= 25) {
      setTags([...tags, cleanTag]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Subtasks manager
  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, title: newSubtaskInput.trim().slice(0, 150), completed: false }
    ]);
    setNewSubtaskInput('');
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = {};

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      newErrors.title = 'Task title is required.';
    } else if (cleanTitle.length > 100) {
      newErrors.title = 'Task title must be 100 characters or less.';
    }

    if (description && description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less.';
    }

    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        newErrors.dueDate = 'Please enter a valid date.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const selectedAssignee = SAMPLE_ASSIGNEES.find((u) => u.id === assigneeId) || null;

    onSave({
      title: cleanTitle,
      description: description ? description.trim() : '',
      status,
      priority,
      dueDate,
      assignee: selectedAssignee,
      tags,
      estimatedHours: Math.max(0, Number(estimatedHours) || 0),
      loggedHours: Math.max(0, Number(loggedHours) || 0),
      subtasks
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-heading"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <h2 id="task-modal-heading" className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {initialData?.id ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close task modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="task-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Task Title <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{title.length}/100</span>
            </div>
            <input
              id="task-title-input"
              type="text"
              maxLength={100}
              value={title}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'task-title-error' : undefined}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              placeholder="e.g. Implement OAuth 2.0 User Login"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 ${
                errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
              }`}
              autoFocus
            />
            {errors.title && (
              <p id="task-title-error" role="alert" className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="task-desc-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <span className="text-[11px] text-slate-400">{description.length}/1000</span>
            </div>
            <textarea
              id="task-desc-input"
              rows={3}
              maxLength={1000}
              value={description}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'task-desc-error' : undefined}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
              placeholder="Provide a detailed description of deliverables..."
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 ${
                errors.description ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.description && (
              <p id="task-desc-error" role="alert" className="mt-1 text-xs text-red-500 font-medium">
                {errors.description}
              </p>
            )}
          </div>

          {/* Grid: Priority, Status, Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority Selector */}
            <div>
              <label htmlFor="task-priority-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Selector */}
            <div>
              <label htmlFor="task-status-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Column Status
              </label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="task-duedate-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Due Date
              </label>
              <input
                id="task-duedate-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
              {errors.dueDate && (
                <p role="alert" className="mt-1 text-xs text-red-500 font-medium">
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Grid: Assignee & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assignee Picker */}
            <div>
              <label htmlFor="task-assignee-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Assignee
              </label>
              <select
                id="task-assignee-select"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {SAMPLE_ASSIGNEES.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Hours Estimate */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="task-esthours-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Est. Hours
                </label>
                <input
                  id="task-esthours-input"
                  type="number"
                  min="0"
                  max="500"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="8"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label htmlFor="task-loghours-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Logged Hours
                </label>
                <input
                  id="task-loghours-input"
                  type="number"
                  min="0"
                  max="500"
                  value={loggedHours}
                  onChange={(e) => setLoggedHours(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Tags Chips Manager */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tags & Labels
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                >
                  #{t}
                  <button
                    type="button"
                    aria-label={`Remove tag ${t}`}
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                placeholder="Add custom tag (press Enter)..."
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Add Tag
              </button>
            </div>

            {/* Preset Suggested Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-[11px] text-slate-400 mr-1">Quick add:</span>
              {AVAILABLE_TAGS.slice(0, 6).map((suggested) => (
                <button
                  type="button"
                  key={suggested}
                  onClick={() => handleAddTag(suggested)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  +{suggested}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks Checklist Manager */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-indigo-500" /> Checklist Subtasks
              </span>
              <span className="text-slate-400 text-[11px] font-normal">
                {subtasks.filter((st) => st.completed).length}/{subtasks.length} completed
              </span>
            </label>

            <div className="space-y-2 mb-3">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs"
                >
                  <label className="flex items-center gap-2 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className={subtask.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                      {subtask.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    aria-label="Remove subtask"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask title..."
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Subtask
              </button>
            </div>
          </div>
        </form>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            {initialData?.id ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
