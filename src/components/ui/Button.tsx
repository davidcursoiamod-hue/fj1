import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  filled: 'bg-primary text-on-primary hover:shadow-soft',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined: 'border border-outline text-primary bg-transparent hover:bg-primary/8',
  text: 'text-primary bg-transparent',
  elevated: 'bg-surface-high text-primary shadow-soft hover:shadow-float',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
};

const iconSize: Record<ButtonSize, number> = { sm: 18, md: 20, lg: 22 };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'filled', size = 'md', icon, iconRight, fullWidth, className, children, ...rest }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.button
        ref={ref}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'state-layer inline-flex items-center justify-center rounded-pill font-medium',
          'transition-colors duration-150 select-none whitespace-nowrap',
          'disabled:opacity-40 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        {icon && <Icon name={icon} size={iconSize[size]} />}
        {children}
        {iconRight && <Icon name={iconRight} size={iconSize[size]} />}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
