import { type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, description, children, actions, className }: DialogProps) {
  const reduced = useReducedMotion();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.12 : 0.2 }}
              />
            </DialogPrimitive.Overlay>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <DialogPrimitive.Content asChild>
              <motion.div
                className={cn(
                  'pointer-events-auto relative w-full max-w-md max-h-full overflow-y-auto',
                  'bg-surface rounded-xl shadow-dialog p-6 outline-none',
                  className,
                )}
                initial={{ opacity: 0, scale: reduced ? 1 : 0.95, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.95, y: reduced ? 0 : 8 }}
                transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 32 }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <DialogPrimitive.Title className="text-xl font-semibold text-on-surface">
                      {title}
                    </DialogPrimitive.Title>
                    {description && (
                      <DialogPrimitive.Description className="text-sm text-on-surface-variant mt-1">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                  <DialogPrimitive.Close asChild>
                    <IconButton icon="close" label="Cerrar" size="sm" />
                  </DialogPrimitive.Close>
                </div>
                <div className="mb-6">{children}</div>
                {actions && (
                  <div className="flex items-center justify-end gap-2">
                    {actions}
                  </div>
                )}
              </motion.div>
            </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
