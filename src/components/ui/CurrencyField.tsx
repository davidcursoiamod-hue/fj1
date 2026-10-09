import { forwardRef, useId, useState, useEffect, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { parseNumberEsCO, formatCOP } from '@/lib/format';

interface CurrencyFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  errorText?: string;
}

export const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  ({ label, value, onChange, helperText, errorText, className, id, onFocus, onBlur, ...rest }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const [focused, setFocused] = useState(false);
    const [display, setDisplay] = useState('');
    const hasError = Boolean(errorText);

    useEffect(() => {
      if (!focused) {
        if (value === 0 || isNaN(value)) {
          setDisplay('');
        } else {
          setDisplay(formatCOP(value));
        }
      }
    }, [value, focused]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
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
          <span className="text-on-surface-variant text-sm mr-1 shrink-0">$</span>
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
              className="w-full bg-transparent pt-4 pb-1 text-base text-on-surface outline-none tabular-nums text-right"
              aria-invalid={hasError || undefined}
              {...rest}
            />
          </div>
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

CurrencyField.displayName = 'CurrencyField';
