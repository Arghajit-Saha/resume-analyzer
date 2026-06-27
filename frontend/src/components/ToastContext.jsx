import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext();

const TOAST_LIMIT = 3;
const TOAST_DURATION = 4000;

const toastConfig = {
  success: {
    bg: 'bg-card',
    border: 'border-success/30',
    bar: 'bg-success',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-card',
    border: 'border-error/30',
    bar: 'bg-error',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-card',
    border: 'border-warning/30',
    bar: 'bg-warning',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-card',
    border: 'border-sky-deep/30',
    bar: 'bg-sky-deep',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-sky-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

let toastIdCounter = 0;

function Toast({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const config = toastConfig[toast.type] || toastConfig.info;
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 280);
    }, TOAST_DURATION);

    return () => clearTimeout(timerRef.current);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 280);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`relative flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-xl shadow-heading/8 backdrop-blur-sm overflow-hidden transition-all duration-300 ${config.bg} ${config.border} ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      <span className="shrink-0 mt-0.5">{config.icon}</span>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-[14px] font-bold text-heading leading-tight mb-0.5">{toast.title}</p>
        )}
        <p className="text-[13px] text-body leading-snug">{toast.message}</p>
      </div>

      <button
        onClick={handleDismiss}
        className="shrink-0 p-1 rounded-lg bg-transparent border-none text-muted cursor-pointer transition-colors duration-200 hover:text-heading hover:bg-edge/50"
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-edge/30">
        <div
          className={`h-full ${config.bar} origin-left`}
          style={{ animation: `toast-progress ${TOAST_DURATION}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message }) => {
    const id = ++toastIdCounter;
    setToasts(prev => {
      const next = [...prev, { id, type, title, message }];
      if (next.length > TOAST_LIMIT) return next.slice(-TOAST_LIMIT);
      return next;
    });
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-auto max-md:bottom-4 max-md:right-4 max-md:left-4"
        aria-label="Notifications"
      >
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
