import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  errorText?: string;
  icon?: string;
  showCounter?: boolean;
  maxLength?: number;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, errorText, icon, showCounter, maxLength, value, defaultValue, className, id, onFocus, onBlur, ...rest }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const [focused, setFocused] = useState(false);
    const hasError = Boolean(errorText);
    const hasValue = Boolean(value ?? defaultValue);
    const isFloating = focused || hasValue;

    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('w-full', className)}>
        <div
          className={cn(
            'relative flex items-center rounded-md border transition-colors duration-150',
            'bg-surface px-3.5 min-h-14',
            hasError
              ? 'border-error'
              : focused
                ? 'border-primary border-2 -m-0.5'
                : 'border-outline-variant',
          )}
        >
          {icon && (
            <Icon
              name={icon}
              size={22}
              className={cn('mr-2 shrink-0', hasError ? 'text-error' : 'text-on-surface-variant')}
            />
          )}
          <div className="relative flex-1">
            <label
              htmlFor={fieldId}
              className={cn(
                'absolute pointer-events-none transition-all duration-150',
                isFloating
                  ? 'text-xs -top-1.5 text-on-surface-variant'
                  : 'text-base top-3.5 text-on-surface-variant',
                hasError && 'text-error',
              )}
            >
              {label}
            </label>
            <input
              ref={ref}
              id={fieldId}
              value={value}
              defaultValue={defaultValue}
              maxLength={maxLength}
              onFocus={(e) => { setFocused(true); onFocus?.(e); }}
              onBlur={(e) => { setFocused(false); onBlur?.(e); }}
              className={cn(
                'w-full bg-transparent pt-4 pb-1 text-base text-on-surface outline-none',
                'placeholder:text-transparent',
              )}
              aria-invalid={hasError || undefined}
              aria-describedby={helperText || errorText ? `${fieldId}-helper` : undefined}
              {...rest}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 px-1">
          <p
            id={`${fieldId}-helper`}
            className={cn(
              'text-xs',
              hasError ? 'text-error' : 'text-on-surface-variant',
            )}
          >
            {hasError ? errorText : helperText}
          </p>
          {showCounter && maxLength && (
            <span className="text-xs text-on-surface-variant tabular-nums">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

TextField.displayName = 'TextField';
