import { forwardRef, useId, useState, useEffect, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { parseNumberEsCO } from '@/lib/format';

interface PercentFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  errorText?: string;
}

export const PercentField = forwardRef<HTMLInputElement, PercentFieldProps>(
  ({ label, value, onChange, helperText, errorText, className, id, onFocus, onBlur, ...rest }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const [focused, setFocused] = useState(false);
    const [display, setDisplay] = useState('');
    const [cursorPos, setCursorPos] = useState<number | null>(null);
    const hasError = Boolean(errorText);

    useEffect(() => {
      if (!focused) {
        if (value === 0 || isNaN(value)) {
          setDisplay('');
        } else {
          // Mostrar con coma decimal es-CO
          setDisplay(value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 4 }));
        }
      }
    }, [value, focused]);

    // Restaurar posición del cursor después de formatear
    useEffect(() => {
      if (focused && cursorPos !== null && ref) {
        const el = (ref as React.RefObject<HTMLInputElement>).current;
        if (el) {
          requestAnimationFrame(() => {
            el.setSelectionRange(cursorPos, cursorPos);
          });
        }
      }
    }, [display, focused, cursorPos, ref]);

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
      const input = e.target;
      setCursorPos(input.selectionStart);
      // Permitir dígitos, coma, punto (para pegar) y signo negativo
      let val = input.value;
      // Reemplazar puntos (separadores de miles) mientras se escribe para evitar ambigüedad
      // Solo permitir una coma decimal
      const hasComma = val.includes(',');
      if (hasComma) {
        const parts = val.split(',');
        // Quitar puntos de la parte entera
        parts[0] = parts[0].replace(/\./g, '');
        val = parts.join(',');
      }
      setDisplay(val);
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
          <span className="text-on-surface-variant text-sm ml-1 shrink-0">%</span>
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

PercentField.displayName = 'PercentField';
