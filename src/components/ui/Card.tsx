import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

type CardVariant = 'filled' | 'elevated' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  filled: 'bg-surface-container',
  elevated: 'bg-surface-low shadow-soft',
  outlined: 'bg-surface border border-outline-variant',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'filled', interactive, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg p-5',
        variantClasses[variant],
        interactive && 'state-layer cursor-pointer transition-shadow duration-200 hover:shadow-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

Card.displayName = 'Card';

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="flex items-start gap-3">
        {icon && <Icon name={icon} size={24} className="text-primary mt-0.5" />}
        <div>
          <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
          {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
