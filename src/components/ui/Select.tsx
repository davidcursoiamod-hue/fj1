import { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ label, value, defaultValue, options, placeholder, helperText, errorText, disabled, className, onChange }, ref) => {
    const hasError = Boolean(errorText);
    const hasValue = Boolean(value ?? defaultValue);

    return (
      <div className={cn('w-full', className)}>
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              'state-layer relative flex w-full items-center rounded-md border bg-surface px-3.5 min-h-14',
              'transition-colors duration-150 text-left',
              hasError
                ? 'border-error'
                : 'border-outline-variant hover:border-outline',
              disabled && 'opacity-50',
            )}
            aria-label={label}
          >
            <div className="flex-1 pt-3">
              <span
                className={cn(
                  'absolute pointer-events-none transition-all duration-150',
                  hasValue
                    ? 'text-xs -top-1.5 text-on-surface-variant'
                    : 'text-base top-3.5 text-on-surface-variant',
                )}
              >
                {label}
              </span>
              <SelectPrimitive.Value
                placeholder={placeholder}
                className={cn('text-base', hasValue ? 'text-on-surface' : 'text-transparent')}
              />
            </div>
            <SelectPrimitive.Icon asChild>
              <Icon name="expand_more" size={24} className="text-on-surface-variant ml-2" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              className="overflow-hidden rounded-md bg-surface-container shadow-float z-50 min-w-[var(--radix-select-trigger-width)] max-h-60"
            >
              <SelectPrimitive.Viewport className="p-1.5">
                {options.map((opt) => (
                  <SelectPrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      'state-layer relative flex items-center rounded-sm py-2.5 pl-8 pr-3 text-sm',
                      'text-on-surface cursor-pointer outline-none data-[highlighted]:bg-primary/10',
                    )}
                  >
                    <SelectPrimitive.ItemIndicator className="absolute left-1.5">
                      <Icon name="check" size={18} className="text-primary" />
                    </SelectPrimitive.ItemIndicator>
                    <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {(helperText || errorText) && (
          <p className={cn('text-xs mt-1 px-1', hasError ? 'text-error' : 'text-on-surface-variant')}>
            {hasError ? errorText : helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
