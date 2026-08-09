# Kanban TaskFlow - SaaS Productivity Suite

An intuitive, high-performance Kanban project management application built with **React 19**, **Tailwind CSS v4**, and **Lucide Icons**. Featuring native drag-and-drop column status transitions, priority filtering, task time logging, calendar scheduling, dark/light theme toggle, and JSON data backup/import.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18%2B-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8)
![Build Status](https://github.com/actions/workflow/status)

---

## 🌟 Features

- **Interactive Kanban Board**:
  - Drag-and-drop tasks across 5 stages (*Backlog*, *To Do*, *In Progress*, *In Review*, *Completed*).
  - Quick column creation buttons and inline status movement.
  - Subtask tracking with interactive progress bars.
  - Tags, priority badges, assignee avatars, and logged hours display.

- **Multiple Views**:
  - 📋 **Kanban Board**: Drag-and-drop workflow visualizer.
  - 📊 **Dashboard**: Summary metrics, velocity stats, priority distribution, and recently updated tasks.
  - 📅 **Calendar View**: Task schedule overlay organized by due dates.
  - 📈 **Analytics**: Team workload distribution, capacity metrics, and time tracking breakdown.
  - ⚙️ **Settings**: Visual theme mode, JSON export/import backup, and demo board reset.

- **Filtering & Search**:
  - Real-time instant search by title, description, or subtasks.
  - Filter by priority (*Low*, *Medium*, *High*, *Urgent*), status, team assignee, and tags.
  - Sorting options by due date, priority, title, or creation date.

- **Data Persistence**:
  - Automatic `localStorage` persistence for seamless offline usage.
  - Full backup **JSON Export** & **JSON Import** capability for data migration.
  - One-click **Reset Demo Board** option.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/kanban-taskflow.git
   cd kanban-taskflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to GitHub Pages

This project includes a pre-configured **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) for automatic deployment to GitHub Pages on every push to `main` or `master`.

### Enabling GitHub Pages in 3 Steps:

1. Push your repository to GitHub.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**.
4. Push a change or run the workflow manually from the **Actions** tab. Your app will be deployed to `https://<your-username>.github.io/<repo-name>/`.

---

## 🛠️ Tech Stack

- **Framework**: React 19 / Vite
- **Styling**: Tailwind CSS v4 & Lucide React Icons
- **Drag & Drop**: Native HTML5 Drag and Drop API
- **State & Storage**: React Hooks & Custom `localStorage` abstraction
- **Deployment**: GitHub Pages (via GitHub Actions)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
