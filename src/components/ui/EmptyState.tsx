import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, actions, className }: EmptyStateProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 32 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className,
      )}
    >
      {icon && <div className="mb-5">{icon}</div>}
      <h2 className="text-xl font-semibold text-on-surface mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">{description}</p>
      )}
      {actions && <div className="mt-6 flex items-center gap-3 flex-wrap justify-center">{actions}</div>}
    </motion.div>
  );
}
