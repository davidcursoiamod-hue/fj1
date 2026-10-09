import { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: T, rowIndex: number) => ReactNode;
  editable?: boolean;
  onEdit?: (row: T, value: string) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onAddRow?: () => void;
  onDeleteRow?: (index: number) => void;
  addLabel?: string;
  emptyMessage?: string;
  className?: string;
  rowKey: (row: T, index: number) => string;
}

export function DataTable<T>({
  columns,
  rows,
  onAddRow,
  onDeleteRow,
  addLabel = 'Agregar fila',
  emptyMessage = 'No hay datos. Agrega una fila para comenzar.',
  className,
  rowKey,
}: DataTableProps<T>) {
  const reduced = useReducedMotion();
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const moveFocus = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      setFocusedCell((prev) => {
        if (!prev) return prev;
        const maxRow = rows.length - 1;
        const maxCol = columns.length - 1;
        let { row, col } = prev;
        if (direction === 'up') row = Math.max(0, row - 1);
        if (direction === 'down') row = Math.min(maxRow, row + 1);
        if (direction === 'left') col = Math.max(0, col - 1);
        if (direction === 'right') col = Math.min(maxCol, col + 1);
        return { row, col };
      });
    },
    [rows.length, columns.length],
  );

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    switch (e.key) {
      case 'ArrowUp': e.preventDefault(); moveFocus('up'); break;
      case 'ArrowDown': e.preventDefault(); moveFocus('down'); break;
      case 'ArrowLeft': e.preventDefault(); moveFocus('left'); break;
      case 'ArrowRight': e.preventDefault(); moveFocus('right'); break;
      case 'Enter':
        e.preventDefault();
        if (e.shiftKey) moveFocus('up');
        else moveFocus('down');
        break;
      case 'Tab':
        if (e.shiftKey) {
          if (col === 0 && row > 0) { e.preventDefault(); setFocusedCell({ row: row - 1, col: columns.length - 1 }); }
        } else {
          if (col === columns.length - 1 && row < rows.length - 1) { e.preventDefault(); setFocusedCell({ row: row + 1, col: 0 }); }
        }
        break;
    }
  };

  const alignClass = (align?: string) =>
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto rounded-md border border-outline-variant">
        <div ref={gridRef} className="min-w-full">
          {/* Header (sticky) */}
          <div className="sticky top-0 z-10 bg-surface-container border-b border-outline-variant">
            <div className="flex">
              {columns.map((col) => (
                <div
                  key={String(col.key)}
                  className={cn(
                    'px-3 py-2.5 text-xs font-medium text-on-surface-variant uppercase tracking-wide whitespace-nowrap',
                    alignClass(col.align),
                  )}
                  style={col.width ? { width: col.width, minWidth: col.width } : { flex: 1 }}
                >
                  {col.header}
                </div>
              ))}
              {onDeleteRow && <div className="w-10 shrink-0" />}
            </div>
          </div>

          {/* Body */}
          {rows.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-on-surface-variant">
              {emptyMessage}
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <div>
                {rows.map((row, rowIndex) => (
                  <motion.div
                    key={rowKey(row, rowIndex)}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    className="flex border-b border-outline-variant/50 last:border-b-0 hover:bg-on-surface/3"
                  >
                    {columns.map((col, colIndex) => (
                      <div
                        key={String(col.key)}
                        className={cn(
                          'px-3 py-2.5 text-sm text-on-surface tabular-nums',
                          alignClass(col.align),
                          focusedCell?.row === rowIndex && focusedCell?.col === colIndex &&
                            'ring-2 ring-primary ring-inset',
                        )}
                        style={col.width ? { width: col.width, minWidth: col.width } : { flex: 1 }}
                        tabIndex={0}
                        onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      >
                        {col.render ? col.render(row, rowIndex) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                      </div>
                    ))}
                    {onDeleteRow && (
                      <div className="w-10 shrink-0 flex items-center justify-center">
                        <IconButton
                          icon="delete"
                          label="Eliminar fila"
                          size="sm"
                          variant="standard"
                          onClick={() => onDeleteRow(rowIndex)}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {onAddRow && (
        <button
          onClick={onAddRow}
          className={cn(
            'state-layer mt-2 inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5',
            'text-sm font-medium text-primary transition-colors duration-150',
          )}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>add</span>
          {addLabel}
        </button>
      )}
    </div>
  );
}
