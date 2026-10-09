import { describe, it, expect } from 'vitest';
import {
  formatCOP, formatNumber, formatPercent, parseNumberEsCO, formatRelativeDate,
} from '@/lib/format';

describe('formatCOP', () => {
  it('formatea enteros con separador de miles', () => {
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
  });
  it('formatea cero', () => {
    expect(formatCOP(0)).toBe('$ 0');
  });
  it('formatea negativos', () => {
    expect(formatCOP(-500000)).toBe('$ -500.000');
  });
});

describe('formatNumber', () => {
  it('2 decimales con coma', () => {
    expect(formatNumber(1234.5, 2)).toBe('1.234,50');
  });
  it('0 decimales', () => {
    expect(formatNumber(1234.5, 0)).toBe('1.235');
  });
});

describe('formatPercent', () => {
  it('formatea porcentaje con coma', () => {
    expect(formatPercent(15.5, 1)).toBe('15,5 %');
  });
});

describe('parseNumberEsCO', () => {
  it('puntos como miles, coma como decimal', () => {
    expect(parseNumberEsCO('1.250,50')).toBe(1250.5);
  });
  it('solo coma', () => {
    expect(parseNumberEsCO('1250,50')).toBe(1250.5);
  });
  it('con símbolo $', () => {
    expect(parseNumberEsCO('$ 1.250.000')).toBe(1250000);
  });
  it('número simple', () => {
    expect(parseNumberEsCO('1250')).toBe(1250);
  });
  it('cadena vacía → 0', () => {
    expect(parseNumberEsCO('')).toBe(0);
  });
  it('múltiples puntos → miles', () => {
    expect(parseNumberEsCO('1.250.000')).toBe(1250000);
  });
  it('punto con 2 decimales → decimal', () => {
    expect(parseNumberEsCO('12.50')).toBe(12.5);
  });
  it('con % al final', () => {
    expect(parseNumberEsCO('15,5%')).toBe(15.5);
  });
});

describe('formatRelativeDate', () => {
  it('hace un momento', () => {
    const now = new Date().toISOString();
    expect(formatRelativeDate(now)).toBe('hace un momento');
  });

  it('hace 2 días', () => {
    const d = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe('hace 2 días');
  });

  it('hace 3 horas', () => {
    const d = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(d)).toBe('hace 3 horas');
  });
});
