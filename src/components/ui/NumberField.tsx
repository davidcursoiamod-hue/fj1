import { forwardRef, useId, useState, useEffect, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { parseNumberEsCO, formatNumber } from '@/lib/format';

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  decimals?: number;
  helperText?: string;
  errorText?: string;
  suffix?: string;
  prefix?: string;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ label, value, onChange, decimals = 0, helperText, errorText, suffix, prefix, className, id, onFocus, onBlur, ...rest }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const [focused, setFocused] = useState(false);
    const [display, setDisplay] = useState('');
    const hasError = Boolean(errorText);

    // When not focused, show formatted value; when focused, show editable text
    useEffect(() => {
      if (!focused) {
        if (value === 0 || value === null || isNaN(value)) {
          setDisplay('');
        } else {
          setDisplay(formatNumber(value, decimals));
        }
      }
    }, [value, decimals, focused]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      // Show raw number for editing
      if (value !== 0 && !isNaN(value)) {
        setDisplay(String(value));
      } else {
        setDisplay('');
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      const parsed = parseNumberEsCO(display);
      onChange(parsed);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplay(e.target.value);
    };

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
          {prefix && <span className="text-on-surface-variant text-sm mr-1 shrink-0">{prefix}</span>}
          <div className="relative flex-1">
            <label
              htmlFor={fieldId}
              className={cn(
                'absolute pointer-events-none transition-all duration-150',
                focused || display !== ''
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
              value={display}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              inputMode="decimal"
              className={cn(
                'w-full bg-transparent pt-4 pb-1 text-base text-on-surface outline-none tabular-nums text-right',
              )}
              aria-invalid={hasError || undefined}
              {...rest}
            />
          </div>
          {suffix && <span className="text-on-surface-variant text-sm ml-1 shrink-0">{suffix}</span>}
        </div>
        {(helperText || errorText) && (
          <p className={cn('text-xs mt-1 px-1', hasError ? 'text-error' : 'text-on-surface-variant')}>
            {hasError ? errorText : helperText}
          </p>
        )}
      </div>
    );
  },
);

NumberField.displayName = 'NumberField';
