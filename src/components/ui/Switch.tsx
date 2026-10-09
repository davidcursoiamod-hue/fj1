import { forwardRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/cn';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, label, disabled, className, id }, ref) => (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm text-on-surface select-none cursor-pointer">
          {label}
        </label>
      )}
      <SwitchPrimitive.Root
        ref={ref}
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-4 w-7 items-center rounded-pill transition-colors duration-200',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          checked ? 'bg-primary' : 'bg-surface-highest border border-outline',
          disabled && 'opacity-50',
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'inline-block h-3 w-3 rounded-full bg-on-primary shadow-sm transition-transform duration-200',
            checked ? 'translate-x-3.5' : 'translate-x-0.5',
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  ),
);

Switch.displayName = 'Switch';
