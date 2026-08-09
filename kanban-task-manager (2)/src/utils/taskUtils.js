import { PRIORITIES } from '../data/initialTasks';

const PRIORITY_RANK = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1
};

/**
 * Filter tasks based on search string and filter options.
 */
export const filterTasks = (tasks = [], filters = {}) => {
  const {
    search = '',
    priority = 'all',
    status = 'all',
    assignee = 'all',
    tag = 'all',
    sortBy = 'default'
  } = filters;

  const searchLower = search.trim().toLowerCase();

  let result = tasks.filter((task) => {
    // Keyword Search
    if (searchLower) {
      const titleMatch = task.title?.toLowerCase().includes(searchLower);
      const descMatch = task.description?.toLowerCase().includes(searchLower);
      const tagMatch = task.tags?.some((t) => t.toLowerCase().includes(searchLower));
      const assigneeMatch = task.assignee?.name?.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch && !tagMatch && !assigneeMatch) {
        return false;
      }
    }

    // Priority Filter
    if (priority !== 'all' && task.priority !== priority) {
      return false;
    }

    // Status Filter
    if (status !== 'all' && task.status !== status) {
      return false;
    }

    // Assignee Filter
    if (assignee !== 'all') {
      if (assignee === 'unassigned' && task.assignee) return false;
      if (assignee !== 'unassigned' && task.assignee?.id !== assignee && task.assignee?.name !== assignee) {
        return false;
      }
    }

    // Tag Filter
    if (tag !== 'all' && (!task.tags || !task.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  // Sort tasks
  return sortTasks(result, sortBy);
};

/**
 * Sort array of tasks based on selected strategy.
 */
export const sortTasks = (tasks = [], sortBy = 'default') => {
  const list = [...tasks];

  switch (sortBy) {
    case 'dueDateAsc':
      return list.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

    case 'dueDateDesc':
      return list.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      });

    case 'priorityHighToLow':
      return list.sort((a, b) => (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0));

    case 'priorityLowToHigh':
      return list.sort((a, b) => (PRIORITY_RANK[a.priority] || 0) - (PRIORITY_RANK[b.priority] || 0));

    case 'titleAsc':
      return list.sort((a, b) => a.title.localeCompare(b.title));

    case 'createdAtDesc':
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    default:
      // Sort by order within column
      return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
};

/**
 * Calculate comprehensive dashboard statistics.
 */
export const calculateStats = (tasks = []) => {
  const total = tasks.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      backlog: 0,
      todo: 0,
      review: 0,
      overdue: 0,
      highOrUrgent: 0,
      completionPercentage: 0,
      totalSubtasks: 0,
      completedSubtasks: 0,
      subtaskPercentage: 0,
      totalLoggedHours: 0,
      totalEstimatedHours: 0,
      statusCounts: { backlog: 0, todo: 0, 'in-progress': 0, review: 0, done: 0 },
      priorityCounts: { urgent: 0, high: 0, medium: 0, low: 0 }
    };
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const completed = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const backlog = tasks.filter((t) => t.status === 'backlog').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const review = tasks.filter((t) => t.status === 'review').length;

  const overdue = tasks.filter(
    (t) => t.status !== 'done' && t.dueDate && t.dueDate < todayStr
  ).length;

  const highOrUrgent = tasks.filter(
    (t) => t.priority === 'urgent' || t.priority === 'high'
  ).length;

  const completionPercentage = Math.round((completed / total) * 100);

  // Subtasks
  let totalSubtasks = 0;
  let completedSubtasks = 0;
  let totalEstimatedHours = 0;
  let totalLoggedHours = 0;

  tasks.forEach((task) => {
    totalEstimatedHours += task.estimatedHours || 0;
    totalLoggedHours += task.loggedHours || 0;

    if (task.subtasks && Array.isArray(task.subtasks)) {
      totalSubtasks += task.subtasks.length;
      completedSubtasks += task.subtasks.filter((st) => st.completed).length;
    }
  });

  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Status breakdown object
  const statusCounts = {
    backlog,
    todo,
    'in-progress': inProgress,
    review,
    done: completed
  };

  // Priority breakdown
  const priorityCounts = {
    urgent: tasks.filter((t) => t.priority === 'urgent').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length
  };

  return {
    total,
    completed,
    inProgress,
    backlog,
    todo,
    review,
    overdue,
    highOrUrgent,
    completionPercentage,
    totalSubtasks,
    completedSubtasks,
    subtaskPercentage,
    totalLoggedHours,
    totalEstimatedHours,
    statusCounts,
    priorityCounts
  };
};

/**
 * Check if a task is overdue.
 */
export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  const todayStr = new Date().toISOString().slice(0, 10);
  return dueDate < todayStr;
};

/**
 * Format date string into human friendly label (e.g., "Aug 12, 2026", "Today", "Tomorrow").
 */
export const formatDateLabel = (dateString) => {
  if (!dateString) return 'No due date';

  const dateObj = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = dateObj - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: dateObj.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Return priority style config.
 */
export const getPriorityConfig = (priority) => {
  return (
    PRIORITIES.find((p) => p.id === priority) || {
      id: priority,
      label: priority,
      color: 'slate',
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200'
    }
  );
};
