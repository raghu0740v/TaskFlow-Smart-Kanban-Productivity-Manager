import { useState, useEffect, useCallback } from 'react';
import { getStoredTasks, saveTasks, resetToSampleTasks } from '../utils/storage';

export function useTasks(onShowToast) {
  const [tasks, setTasks] = useState(() => getStoredTasks());

  // Keep localStorage in sync whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Sync tasks across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'taskflow_tasks_v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setTasks(parsed);
          }
        } catch (err) {
          console.error('Failed to parse updated tasks from storage event:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Create new task
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || '',
      tags: taskData.tags || [],
      assignee: taskData.assignee || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0,
      estimatedHours: Number(taskData.estimatedHours) || 0,
      loggedHours: Number(taskData.loggedHours) || 0,
      subtasks: taskData.subtasks || []
    };

    setTasks((prev) => [newTask, ...prev]);

    if (onShowToast) {
      onShowToast(`Created task: "${newTask.title}"`, 'success');
    }
    return newTask;
  }, [onShowToast]);

  // Duplicate an existing task
  const duplicateTask = useCallback((taskId) => {
    let duplicatedTitle = '';
    setTasks((prev) => {
      const original = prev.find((t) => t.id === taskId);
      if (!original) return prev;

      duplicatedTitle = `${original.title} (Copy)`;

      const copy = {
        ...original,
        id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: duplicatedTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: original.subtasks
          ? original.subtasks.map((st, i) => ({
              ...st,
              id: `sub-${Date.now()}-${i}`
            }))
          : []
      };

      const originalIndex = prev.findIndex((t) => t.id === taskId);
      const nextTasks = [...prev];
      nextTasks.splice(originalIndex + 1, 0, copy);
      return nextTasks;
    });

    if (onShowToast && duplicatedTitle) {
      onShowToast(`Duplicated: "${duplicatedTitle}"`, 'success');
    }
  }, [onShowToast]);

  // Update existing task
  const updateTask = useCallback((taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            ...updatedFields,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );

    if (onShowToast) {
      onShowToast('Task updated successfully', 'info');
    }
  }, [onShowToast]);

  // Delete task
  const deleteTask = useCallback((taskId) => {
    let deletedTitle = '';
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (target) deletedTitle = target.title;
      return prev.filter((t) => t.id !== taskId);
    });

    if (onShowToast && deletedTitle) {
      onShowToast(`Deleted task: "${deletedTitle}"`, 'warning');
    }
  }, [onShowToast]);

  // Move task to new status column or reorder within column
  const moveTaskStatus = useCallback((taskId, newStatus, targetIndex = 0) => {
    setTasks((prev) => {
      const taskToMove = prev.find((t) => t.id === taskId);
      if (!taskToMove) return prev;

      const oldStatus = taskToMove.status;

      // Filter out moved task
      const remaining = prev.filter((t) => t.id !== taskId);

      // Tasks in target status
      const targetColumnTasks = remaining.filter((t) => t.status === newStatus);

      // Tasks in other statuses
      const otherTasks = remaining.filter((t) => t.status !== newStatus);

      // Insert task at targetIndex
      const updatedTask = {
        ...taskToMove,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      const newColumnTasks = [...targetColumnTasks];
      const validIndex = Math.max(0, Math.min(targetIndex, newColumnTasks.length));
      newColumnTasks.splice(validIndex, 0, updatedTask);

      // Re-index order property for target column
      const reindexedTarget = newColumnTasks.map((t, index) => ({
        ...t,
        order: index
      }));

      const finalTasks = [...otherTasks, ...reindexedTarget];

      if (onShowToast && oldStatus !== newStatus) {
        onShowToast(
          `Moved "${taskToMove.title}" to ${newStatus.replace('-', ' ').toUpperCase()}`,
          'success'
        );
      }

      return finalTasks;
    });
  }, [onShowToast]);

  // Toggle subtask completion
  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return {
            ...t,
            subtasks: updatedSubtasks,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  }, []);

  // Reset to factory sample tasks
  const resetBoardData = useCallback(() => {
    const defaultData = resetToSampleTasks();
    setTasks(defaultData);
    if (onShowToast) {
      onShowToast('Board reset to sample dataset', 'info');
    }
  }, [onShowToast]);

  // Import external tasks
  const importTasksData = useCallback((importedTasks) => {
    setTasks(importedTasks);
    if (onShowToast) {
      onShowToast(`Imported ${importedTasks.length} tasks successfully`, 'success');
    }
  }, [onShowToast]);

  return {
    tasks,
    setTasks,
    addTask,
    duplicateTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    toggleSubtask,
    resetBoardData,
    importTasksData
  };
}
