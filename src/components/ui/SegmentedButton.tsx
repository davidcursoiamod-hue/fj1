import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface SegmentedButtonOption {
  value: string;
  label: string;
  icon?: string;
}

interface SegmentedButtonProps {
  options: SegmentedButtonOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedButton({ options, value, onChange, className }: SegmentedButtonProps) {
  const reduced = useReducedMotion();
  return (
    <div
      className={cn('inline-flex rounded-pill border border-outline-variant overflow-hidden', className)}
      role="radiogroup"
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'state-layer relative inline-flex items-center justify-center gap-1.5 h-10 px-3.5 text-sm font-medium',
              'transition-colors duration-150 select-none',
              i > 0 && 'border-l border-outline-variant',
              selected ? 'text-on-secondary-container' : 'text-on-surface-variant',
            )}
          >
            {selected && (
              <motion.div
                layoutId="segmented-bg"
                className="absolute inset-0 bg-secondary-container"
                transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {selected && <Icon name="check" size={18} />}
              {opt.icon && !selected && <Icon name={opt.icon} size={18} />}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
