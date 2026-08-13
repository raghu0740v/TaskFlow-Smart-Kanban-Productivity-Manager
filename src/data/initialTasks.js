export const SAMPLE_ASSIGNEES = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@taskflow.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'Lead UI/UX Designer'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@taskflow.dev',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    role: 'Senior Full Stack Dev'
  },
  {
    id: 'user-3',
    name: 'Marcus Vance',
    email: 'marcus.v@taskflow.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'Backend Architect'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'elena.r@taskflow.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'Product Manager'
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david.kim@taskflow.dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'QA Automation Lead'
  }
];

export const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'slate' },
  { id: 'todo', title: 'To Do', color: 'blue' },
  { id: 'in-progress', title: 'In Progress', color: 'amber' },
  { id: 'review', title: 'Review', color: 'purple' },
  { id: 'done', title: 'Done', color: 'emerald' }
];

export const PRIORITIES = [
  { id: 'urgent', label: 'Urgent', color: 'red', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' },
  { id: 'high', label: 'High', color: 'orange', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50' },
  { id: 'medium', label: 'Medium', color: 'amber', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
  { id: 'low', label: 'Low', color: 'slate', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800' }
];

export const AVAILABLE_TAGS = [
  'Frontend',
  'Backend',
  'UI/UX',
  'API',
  'Database',
  'Bug',
  'Security',
  'DevOps',
  'Testing',
  'Feature',
  'Documentation'
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Design Dark & Light Theme Tokens',
    description: 'Establish high-contrast WCAG 2.1 AA color semantic tokens for dark and light surfaces in Tailwind v4.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-08-12',
    tags: ['UI/UX', 'Frontend'],
    assignee: SAMPLE_ASSIGNEES[0],
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-08T14:30:00.000Z',
    order: 0,
    estimatedHours: 8,
    loggedHours: 6,
    subtasks: [
      { id: 'sub-1', title: 'Define slate palette scales', completed: true },
      { id: 'sub-2', title: 'Map accent indigo and emerald variables', completed: true },
      { id: 'sub-3', title: 'Verify contrast ratio on OLED screens', completed: false }
    ]
  },
  {
    id: 'task-102',
    title: 'Implement LocalStorage State Sync Hook',
    description: 'Create custom useLocalStorage and useTasks hooks to handle persistent CRUD operations seamlessly without backend dependency.',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2026-08-10',
    tags: ['Frontend', 'Feature'],
    assignee: SAMPLE_ASSIGNEES[1],
    createdAt: '2026-08-02T10:15:00.000Z',
    updatedAt: '2026-08-08T16:00:00.000Z',
    order: 1,
    estimatedHours: 6,
    loggedHours: 4,
    subtasks: [
      { id: 'sub-102-1', title: 'Error boundary handling for quota limits', completed: true },
      { id: 'sub-102-2', title: 'Cross-tab event storage listener', completed: true },
      { id: 'sub-102-3', title: 'Initial sample fallback data loader', completed: true }
    ]
  },
  {
    id: 'task-103',
    title: 'HTML5 Drag & Drop Reordering Pipeline',
    description: 'Build fluid native HTML5 drag-and-drop dropzones for columns with drop indicators and smooth state reordering.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-08-14',
    tags: ['Frontend', 'UI/UX'],
    assignee: SAMPLE_ASSIGNEES[1],
    createdAt: '2026-08-03T11:00:00.000Z',
    updatedAt: '2026-08-03T11:00:00.000Z',
    order: 0,
    estimatedHours: 12,
    loggedHours: 0,
    subtasks: [
      { id: 'sub-103-1', title: 'Drag handle visuals and ghost effect', completed: false },
      { id: 'sub-103-2', title: 'Target column active hover state', completed: false },
      { id: 'sub-103-3', title: 'Mobile fallback move actions', completed: false }
    ]
  },
  {
    id: 'task-104',
    title: 'Task Filtering & Multi-Option Sorting Toolbar',
    description: 'Allow search by keyword across title/description, plus combination filtering by Priority, Status, Assignee, Tag, and Due Date sorting.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-08-15',
    tags: ['Frontend', 'Feature'],
    assignee: SAMPLE_ASSIGNEES[3],
    createdAt: '2026-08-04T13:20:00.000Z',
    updatedAt: '2026-08-04T13:20:00.000Z',
    order: 1,
    estimatedHours: 5,
    loggedHours: 0,
    subtasks: [
      { id: 'sub-104-1', title: 'Dynamic tag filter chips', completed: false },
      { id: 'sub-104-2', title: 'Clear filters badge indicator', completed: false }
    ]
  },
  {
    id: 'task-105',
    title: 'Analytics Dashboard Metrics & Visual Charts',
    description: 'Calculate productivity stats: completion rate, priority distribution, overdue warnings, and interactive SVG progress gauges.',
    status: 'review',
    priority: 'medium',
    dueDate: '2026-08-09',
    tags: ['Frontend', 'Feature'],
    assignee: SAMPLE_ASSIGNEES[2],
    createdAt: '2026-08-02T14:00:00.000Z',
    updatedAt: '2026-08-08T18:20:00.000Z',
    order: 0,
    estimatedHours: 10,
    loggedHours: 9,
    subtasks: [
      { id: 'sub-105-1', title: 'Compute total, overdue, and high-priority metrics', completed: true },
      { id: 'sub-105-2', title: 'Render custom SVG status bar chart', completed: true },
      { id: 'sub-105-3', title: 'Assignee workload distribution chart', completed: true }
    ]
  },
  {
    id: 'task-106',
    title: 'Interactive Calendar View for Due Dates',
    description: 'Render monthly calendar grid mapping task cards on their scheduled due dates with direct click-to-view modal integration.',
    status: 'review',
    priority: 'low',
    dueDate: '2026-08-11',
    tags: ['Frontend', 'Feature'],
    assignee: SAMPLE_ASSIGNEES[0],
    createdAt: '2026-08-03T08:00:00.000Z',
    updatedAt: '2026-08-08T11:10:00.000Z',
    order: 1,
    estimatedHours: 8,
    loggedHours: 7,
    subtasks: [
      { id: 'sub-106-1', title: 'Monthly grid generator with past/next month overflow', completed: true },
      { id: 'sub-106-2', title: 'Task pills mapping per date cell', completed: true },
      { id: 'sub-106-3', title: 'Date navigation controls (Prev/Next/Today)', completed: true }
    ]
  },
  {
    id: 'task-107',
    title: 'Export & Import Board Backup Schema',
    description: 'Provide JSON export and import capabilities in Settings view to backup, restore, or migrate Kanban state safely.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-08-05',
    tags: ['Feature', 'DevOps'],
    assignee: SAMPLE_ASSIGNEES[2],
    createdAt: '2026-07-28T09:00:00.000Z',
    updatedAt: '2026-08-05T16:00:00.000Z',
    order: 0,
    estimatedHours: 4,
    loggedHours: 4,
    subtasks: [
      { id: 'sub-107-1', title: 'JSON file downloader utility', completed: true },
      { id: 'sub-107-2', title: 'Schema validator on import upload', completed: true }
    ]
  },
  {
    id: 'task-108',
    title: 'Audit Accessibility & Keyboard Shortcuts',
    description: 'Ensure focus rings, ARIA labels, modal trap-focus, and keyboard navigation (Esc to close, Cmd+K to search) function flawlessly.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-08-06',
    tags: ['Security', 'UI/UX'],
    assignee: SAMPLE_ASSIGNEES[4],
    createdAt: '2026-07-29T10:00:00.000Z',
    updatedAt: '2026-08-06T12:00:00.000Z',
    order: 1,
    estimatedHours: 6,
    loggedHours: 6,
    subtasks: [
      { id: 'sub-108-1', title: 'Add aria-expanded and roles to modals', completed: true },
      { id: 'sub-108-2', title: 'Test screen reader announcements for drag events', completed: true }
    ]
  },
  {
    id: 'task-109',
    title: 'API Rate Limiting & Auth Mock Specs',
    description: 'Draft API contracts and OpenAPI specifications for future REST backend migration endpoints.',
    status: 'backlog',
    priority: 'low',
    dueDate: '2026-08-25',
    tags: ['API', 'Documentation'],
    assignee: SAMPLE_ASSIGNEES[2],
    createdAt: '2026-08-05T14:00:00.000Z',
    updatedAt: '2026-08-05T14:00:00.000Z',
    order: 0,
    estimatedHours: 14,
    loggedHours: 0,
    subtasks: [
      { id: 'sub-109-1', title: 'Swagger / OpenAPI 3.0 draft', completed: false },
      { id: 'sub-109-2', title: 'JWT token refresh flow blueprint', completed: false }
    ]
  },
  {
    id: 'task-110',
    title: 'Automated E2E Test Suite Setup',
    description: 'Set up component regression tests for drag-drop events, local storage persistence, and filter operations.',
    status: 'backlog',
    priority: 'medium',
    dueDate: '2026-08-28',
    tags: ['Testing', 'DevOps'],
    assignee: SAMPLE_ASSIGNEES[4],
    createdAt: '2026-08-06T15:00:00.000Z',
    updatedAt: '2026-08-06T15:00:00.000Z',
    order: 1,
    estimatedHours: 12,
    loggedHours: 0,
    subtasks: [
      { id: 'sub-110-1', title: 'Mock localStorage environment', completed: false },
      { id: 'sub-110-2', title: 'Test column transition edge cases', completed: false }
    ]
  },
  {
    id: 'task-111',
    title: 'Optimistic UI Toast Feedback Banner',
    description: 'Provide instant interactive toast notifications with undo actions when tasks are moved, updated, or deleted.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-08-07',
    tags: ['Frontend', 'UI/UX'],
    assignee: SAMPLE_ASSIGNEES[0],
    createdAt: '2026-07-30T10:00:00.000Z',
    updatedAt: '2026-08-07T17:00:00.000Z',
    order: 2,
    estimatedHours: 5,
    loggedHours: 5,
    subtasks: [
      { id: 'sub-111-1', title: 'Floating toast queue component', completed: true },
      { id: 'sub-111-2', title: 'Auto-dismiss timer with pause-on-hover', completed: true }
    ]
  },
  {
    id: 'task-112',
    title: 'Mobile Responsive Horizontal Scroll & Swipe',
    description: 'Ensure smooth touch horizontal scrolling for Kanban board on mobile viewports with snap columns.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-08-18',
    tags: ['Frontend', 'UI/UX'],
    assignee: SAMPLE_ASSIGNEES[3],
    createdAt: '2026-08-07T09:30:00.000Z',
    updatedAt: '2026-08-07T09:30:00.000Z',
    order: 2,
    estimatedHours: 7,
    loggedHours: 1,
    subtasks: [
      { id: 'sub-112-1', title: 'Column container scroll-snap-type CSS', completed: false },
      { id: 'sub-112-2', title: 'Mobile column selector jump tabs', completed: false }
    ]
  }
];
