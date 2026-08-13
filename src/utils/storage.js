import { INITIAL_TASKS } from '../data/initialTasks';

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  THEME: 'taskflow_theme_v1',
  FILTERS: 'taskflow_filters_v1',
  VIEW: 'taskflow_current_view_v1',
};

/**
 * Load tasks from localStorage, or populate with initial sample tasks if empty.
 */
export const getStoredTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to read tasks from localStorage:', error);
    return INITIAL_TASKS;
  }
};

/**
 * Save tasks array to localStorage.
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

/**
 * Reset tasks to factory default sample tasks.
 */
export const resetToSampleTasks = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  } catch (error) {
    console.error('Failed to reset sample tasks:', error);
    return INITIAL_TASKS;
  }
};

/**
 * Get stored theme ('dark' | 'light' | 'system').
 */
export const getStoredTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'system';
  } catch {
    return 'system';
  }
};

/**
 * Save theme preference to localStorage.
 */
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};

/**
 * Save active filter options.
 */
export const saveFilterState = (filters) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters:', error);
  }
};

/**
 * Get active filter options.
 */
export const getStoredFilterState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Export board data to downloadable JSON string.
 */
export const exportBoardData = (tasks) => {
  const data = {
    app: 'TaskFlow Kanban',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    tasksCount: tasks.length,
    tasks
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-kanban-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Parse and validate imported JSON file.
 */
export const parseImportedBoardData = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    let tasksToImport = [];

    if (Array.isArray(parsed)) {
      tasksToImport = parsed;
    } else if (parsed && Array.isArray(parsed.tasks)) {
      tasksToImport = parsed.tasks;
    } else {
      throw new Error('Invalid JSON structure: expected array or object with tasks array');
    }

    // Basic schema check
    const validTasks = tasksToImport.filter(
      (t) => t && t.id && t.title && t.status
    );

    if (validTasks.length === 0) {
      throw new Error('No valid tasks found in imported file');
    }

    return validTasks;
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
};
