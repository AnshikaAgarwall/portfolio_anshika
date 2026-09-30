// App-wide toast notifications.
//   const toast = useToast();
//   toast.success('Email copied');   toast.error('Could not send');
// Toasts stack bottom-right (full width on mobile), auto-dismiss after 5s and
// have a 44px close button. Success is announced politely (role="status"),
// errors assertively (role="alert"). <ToastProvider> wraps the app in App.jsx.
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../utils/cn.js';
import { EASE_EDITORIAL } from '../utils/motion.js';

const ToastContext = createContext(null);
const DURATION = 5000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback(
    (type, message) => {
      const id = ++nextId.current;
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({ success: (msg) => show('success', msg), error: (msg) => show('error', msg) }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-end gap-3 md:inset-x-auto md:right-6 md:w-96">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              role={toast.type === 'error' ? 'alert' : 'status'}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: EASE_EDITORIAL }}
              className={cn(
                'surface-dark pointer-events-auto flex w-full items-start gap-4 border-l-4 bg-ink py-3 pl-4 pr-1 text-paper',
                toast.type === 'error' ? 'border-paper' : 'border-paper/40',
              )}
            >
              <p className="flex-1 py-2.5 text-sm leading-snug">
                <span className="label mr-2 font-semibold">{toast.type === 'error' ? 'Error' : 'Done'}</span>
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="flex h-11 w-11 shrink-0 items-center justify-center"
              >
                <span aria-hidden="true" className="relative block h-3.5 w-3.5">
                  <span className="absolute left-0 top-1/2 block h-px w-3.5 rotate-45 bg-paper" />
                  <span className="absolute left-0 top-1/2 block h-px w-3.5 -rotate-45 bg-paper" />
                </span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
