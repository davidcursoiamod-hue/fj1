import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
  label: string;
}

const sizeMap = {
  sm: { box: 'w-8 h-8', icon: 18 },
  md: { box: 'w-10 h-10', icon: 22 },
  lg: { box: 'w-12 h-12', icon: 26 },
};

const variantMap = {
  standard: 'text-on-surface-variant hover:bg-on-surface/8',
  filled: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined: 'border border-outline text-on-surface-variant',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'standard', label, className, ...rest }, ref) => {
    const reduced = useReducedMotion();
    const s = sizeMap[size];
    return (
      <motion.button
        ref={ref}
        whileTap={reduced ? undefined : { scale: 0.9 }}
        transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'state-layer inline-flex items-center justify-center rounded-pill',
          'transition-colors duration-150 select-none',
          'disabled:opacity-40 disabled:pointer-events-none',
          s.box,
          variantMap[variant],
          className,
        )}
        aria-label={label}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        <Icon name={icon} size={s.icon} />
      </motion.button>
    );
  },
);

IconButton.displayName = 'IconButton';
