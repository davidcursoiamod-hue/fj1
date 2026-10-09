import { describe, it, expect } from 'vitest';
import { describeImportResult } from '@/lib/importMessage';

describe('describeImportResult', () => {
  it('éxito con un proyecto', () => {
    expect(describeImportResult({ success: true, imported: 1, errors: [] })).toEqual({
      message: '1 proyecto importado correctamente.',
      variant: 'success',
    });
  });
  it('éxito con varios proyectos', () => {
    expect(describeImportResult({ success: true, imported: 3, errors: [] }).message).toBe('3 proyectos importados correctamente.');
  });
  it('éxito parcial', () => {
    const r = describeImportResult({ success: false, imported: 2, errors: ['a', 'b'] });
    expect(r.variant).toBe('default');
    expect(r.message).toContain('2 proyectos importados');
    expect(r.message).toContain('2 dato(s)');
  });
  it('JSON inválido conserva el mensaje original', () => {
    const r = describeImportResult({ success: false, imported: 0, errors: ['El archivo no es JSON válido.'] });
    expect(r).toEqual({ message: 'El archivo no es JSON válido.', variant: 'error' });
  });
  it('esquema inválido da un mensaje genérico en español', () => {
    const r = describeImportResult({ success: false, imported: 0, errors: ['meta.name: Invalid input'] });
    expect(r.variant).toBe('error');
    expect(r.message).toContain('formato de un proyecto de Formula');
    expect(r.message).not.toContain('Invalid');
  });
});
