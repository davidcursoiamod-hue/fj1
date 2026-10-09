import { type ReactNode, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import {
  type SnackbarState,
  type SnackbarVariant,
  _registerSnackbarShow,
} from './snackbarStore';

const variantIcon: Record<SnackbarVariant, string> = {
  default: 'info',
  success: 'check_circle',
  error: 'error',
};

const variantClass: Record<SnackbarVariant, string> = {
  default: 'bg-on-surface text-surface',
  success: 'bg-primary text-on-primary',
  error: 'bg-error text-on-error',
};

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState | null>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  const show = useCallback((s: SnackbarState) => {
    setState(s);
    setVisible(true);
  }, []);

  useEffect(() => {
    _registerSnackbarShow(show);
    return () => { _registerSnackbarShow(null); };
  }, [show]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [visible, state]);

  return (
    <>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-full max-w-md px-4">
        <AnimatePresence>
          {visible && state && (
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : 16 }}
              transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 32 }}
              className={cn(
                'flex items-center gap-3 rounded-md px-4 py-3.5 shadow-float pointer-events-auto',
                variantClass[state.variant],
              )}
              role="alert"
            >
              <Icon name={variantIcon[state.variant]} size={22} />
              <span className="flex-1 text-sm font-medium">{state.message}</span>
              {state.actionLabel && state.onAction && (
                <button
                  onClick={() => { state.onAction?.(); setVisible(false); }}
                  className="state-layer text-sm font-semibold px-2 py-1 rounded-sm shrink-0"
                >
                  {state.actionLabel}
                </button>
              )}
              <button
                onClick={() => setVisible(false)}
                className="state-layer rounded-pill p-1 shrink-0"
                aria-label="Cerrar"
              >
                <Icon name="close" size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
