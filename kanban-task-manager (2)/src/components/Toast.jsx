import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { message, type = 'info' } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100',
    warning: 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-100',
    error: 'border-red-500/20 bg-red-50/90 dark:bg-red-950/80 text-red-900 dark:text-red-100',
    info: 'border-indigo-500/20 bg-indigo-50/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${borders[type] || borders.info}`}>
        {icons[type] || icons.info}
        <div className="flex-1 text-sm font-medium leading-snug">{message}</div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
