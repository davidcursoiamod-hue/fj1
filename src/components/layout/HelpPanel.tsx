import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/ui/IconButton';

interface HelpPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function HelpPanel({ title, children, className }: HelpPanelProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <>
      <IconButton
        icon="help"
        label="¿Qué es esto?"
        variant="tonal"
        size="sm"
        onClick={() => setOpen(true)}
        className={className}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              className={cn(
                'absolute right-0 top-0 bottom-0 w-full max-w-sm',
                'bg-surface p-6 overflow-y-auto shadow-dialog',
              )}
              initial={{ x: reduced ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduced ? 0 : '100%' }}
              transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 360, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-on-surface pr-8">{title}</h2>
                <IconButton icon="close" label="Cerrar" size="sm" onClick={() => setOpen(false)} />
              </div>
              <div className="text-sm text-on-surface-variant leading-relaxed">{children}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
