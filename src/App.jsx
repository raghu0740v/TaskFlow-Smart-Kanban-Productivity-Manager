import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KanbanBoard from './components/KanbanBoard';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import SettingsPage from './components/SettingsPage';
import TaskModal from './components/TaskModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';

import { useTasks } from './hooks/useTasks';
import { useLocalStorage } from './hooks/useLocalStorage';
import { filterTasks, calculateStats } from './utils/taskUtils';

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useLocalStorage('taskflow_view', 'board');

  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useLocalStorage('taskflow_theme', 'dark');

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Task Data State
  const {
    tasks,
    addTask,
    duplicateTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    toggleSubtask,
    resetBoardData,
    importTasksData
  } = useTasks(showToast);

  // Filter & Sort State
  const initialFilters = {
    search: '',
    priority: 'all',
    status: 'all',
    assignee: 'all',
    tag: 'all',
    sortBy: 'default'
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
    showToast('Filters cleared', 'info');
  }, [showToast]);

  // Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultModalColumn, setDefaultModalColumn] = useState('todo');

  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  // Confirm Delete / Reset Dialog State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: () => {}
  });

  // Apply Theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Cmd/Ctrl + K => Focus search input in Board view
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveView('board');
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search tasks"]');
          if (searchInput) searchInput.focus();
        }, 50);
      }
      // Cmd/Ctrl + Shift + N => Create task
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setTaskToEdit(null);
        setDefaultModalColumn('todo');
        setIsTaskModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [setActiveView]);

  // Derived filtered tasks & statistics
  const filteredTasksList = useMemo(() => {
    return filterTasks(tasks, filters);
  }, [tasks, filters]);

  const taskStats = useMemo(() => {
    return calculateStats(tasks);
  }, [tasks]);

  // Modal Triggers
  const handleOpenCreateModal = (columnId = 'todo') => {
    setTaskToEdit(null);
    setDefaultModalColumn(columnId);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTaskModal = (taskData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleDeleteTaskPrompt = (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to delete "${taskToDelete?.title || 'this task'}"? This action cannot be undone.`,
      confirmText: 'Delete Task',
      onConfirm: () => {
        deleteTask(taskId);
        if (selectedTaskDetails?.id === taskId) {
          setSelectedTaskDetails(null);
        }
      }
    });
  };

  const handleResetDataPrompt = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset Demo Data',
      message: 'This will reset your Kanban board to the initial sample tasks dataset. Any custom tasks you created will be replaced.',
      confirmText: 'Reset Board',
      onConfirm: () => {
        resetBoardData();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        taskStats={taskStats}
        onOpenCreateModal={() => handleOpenCreateModal('todo')}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Workspace Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <Header
          activeView={activeView}
          theme={theme}
          setTheme={setTheme}
          onOpenCreateModal={() => handleOpenCreateModal('todo')}
          setMobileOpen={setMobileOpen}
          onResetData={handleResetDataPrompt}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeView === 'board' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                onClearFilters={handleClearFilters}
              />

              <KanbanBoard
                filteredTasks={filteredTasksList}
                onOpenCreateForColumn={(colId) => handleOpenCreateModal(colId)}
                onViewDetails={(task) => setSelectedTaskDetails(task)}
                onEdit={handleOpenEditModal}
                onDuplicate={duplicateTask}
                onDelete={handleDeleteTaskPrompt}
                onMoveStatus={moveTaskStatus}
                onToggleSubtask={toggleSubtask}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}

          {activeView === 'dashboard' && (
            <Dashboard
              stats={taskStats}
              tasks={tasks}
              onOpenCreateModal={() => handleOpenCreateModal('todo')}
              onViewDetails={(task) => setSelectedTaskDetails(task)}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              tasks={tasks}
              onViewDetails={(task) => setSelectedTaskDetails(task)}
              onOpenCreateForDate={(dateStr) => {
                setTaskToEdit({ dueDate: dateStr });
                setDefaultModalColumn('todo');
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activeView === 'analytics' && (
            <Analytics stats={taskStats} tasks={tasks} />
          )}

          {activeView === 'settings' && (
            <SettingsPage
              theme={theme}
              setTheme={setTheme}
              tasks={tasks}
              onResetData={handleResetDataPrompt}
              onImportTasks={importTasksData}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        initialData={taskToEdit}
        defaultStatus={defaultModalColumn}
        onSave={handleSaveTaskModal}
        onClose={() => setIsTaskModalOpen(false)}
      />

      {/* Detailed Task View Modal */}
      <TaskDetailsModal
        task={selectedTaskDetails}
        isOpen={Boolean(selectedTaskDetails)}
        onClose={() => setSelectedTaskDetails(null)}
        onEdit={handleOpenEditModal}
        onDuplicate={duplicateTask}
        onDelete={handleDeleteTaskPrompt}
        onMoveStatus={moveTaskStatus}
        onToggleSubtask={toggleSubtask}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
