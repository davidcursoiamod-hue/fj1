import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

type ChipVariant = 'assist' | 'filter' | 'input';

interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: string;
  variant?: ChipVariant;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  children?: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ label, selected, icon, variant = 'assist', onClick, onRemove, className }, ref) => {
    const interactive = Boolean(onClick);
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={!interactive && !onRemove}
        className={cn(
          'state-layer inline-flex items-center gap-1.5 rounded-sm h-8 px-3 text-sm font-medium',
          'transition-colors duration-150 select-none',
          selected
            ? 'bg-secondary-container text-on-secondary-container'
            : 'border border-outline-variant text-on-surface-variant',
          interactive && 'cursor-pointer',
          !interactive && !onRemove && 'cursor-default',
          className,
        )}
        aria-pressed={variant === 'filter' ? selected : undefined}
      >
        {variant === 'filter' && selected && <Icon name="check" size={18} />}
        {icon && !selected && <Icon name={icon} size={18} />}
        <span>{label}</span>
        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onRemove(); } }}
            className="ml-0.5 -mr-1 p-0.5 rounded-pill state-layer cursor-pointer"
            aria-label={`Quitar ${label}`}
          >
            <Icon name="close" size={16} />
          </span>
        )}
      </button>
    );
  },
);

Chip.displayName = 'Chip';
