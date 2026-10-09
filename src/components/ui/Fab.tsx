import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  label: string;
  extended?: boolean;
  children?: ReactNode;
}

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  ({ icon = 'add', label, extended, className, children, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.button
        ref={ref}
        whileTap={reduced ? undefined : { scale: 0.95 }}
        transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'state-layer inline-flex items-center gap-2.5 rounded-pill px-4 h-14',
          'bg-primary text-on-primary shadow-float font-medium text-sm',
          'transition-colors duration-150 select-none',
          'disabled:opacity-40 disabled:pointer-events-none',
          className,
        )}
        aria-label={label}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        <Icon name={icon} size={24} />
        {extended && <span>{children ?? label}</span>}
      </motion.button>
    );
  },
);

Fab.displayName = 'Fab';
