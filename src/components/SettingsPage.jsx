import React, { useRef, useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Database,
  FileCode2
} from 'lucide-react';
import { exportBoardData, parseImportedBoardData } from '../utils/storage';

export default function SettingsPage({
  theme,
  setTheme,
  tasks,
  onResetData,
  onImportTasks,
  onShowToast
}) {
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState('');

  const handleExport = () => {
    exportBoardData(tasks);
    if (onShowToast) {
      onShowToast(`Exported ${tasks.length} tasks to JSON backup`, 'success');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const validTasks = parseImportedBoardData(text);
        onImportTasks(validTasks);
        setImportError('');
      } catch (err) {
        setImportError(err.message);
        if (onShowToast) {
          onShowToast(`Import failed: ${err.message}`, 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      {/* Theme Options */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Appearance & Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Customize visual theme and interface mode</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 font-semibold ring-2 ring-indigo-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <p className="text-sm font-bold">Light Mode</p>
              <p className="text-xs opacity-75">Clean, high-contrast crisp theme</p>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-indigo-950/80 border-indigo-500 text-indigo-100 font-semibold ring-2 ring-indigo-500/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <p className="text-sm font-bold">Dark Mode</p>
              <p className="text-xs opacity-75">Sleek dark canvas for night coding</p>
            </div>
          </button>
        </div>
      </div>

      {/* Local Data Storage Backup & Restore */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Data Persistence & Backup</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All data is stored locally in your browser's <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">localStorage</code>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex flex-col items-center text-center group"
          >
            <Download className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Export Board Data</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Download JSON backup file</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex flex-col items-center text-center group"
          >
            <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Import JSON Backup</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Restore from file upload</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex flex-col items-center text-center group"
          >
            <RotateCcw className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Reset Demo Board</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Restore sample tasks dataset</span>
          </button>
        </div>

        {importError && (
          <p className="mt-4 p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
            {importError}
          </p>
        )}
      </div>

      {/* Tech Spec Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Architecture & Technical Stack</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">SaaS Recruiter Portfolio Implementation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100">Frontend Framework:</span> React 19 (JavaScript ES6+)
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100">Styling Engine:</span> Tailwind CSS v4 & Lucide Icons
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100">State Persistence:</span> Browser LocalStorage with fallback hooks
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100">Drag & Drop:</span> Native HTML5 Drag and Drop API
          </div>
        </div>
      </div>
    </div>
  );
}
