import { describe, it, expect } from 'vitest';
import { isValidRatePct, DEFAULT_DISCOUNT_RATE_PCT, getDefaultDiscountRatePct, setDefaultDiscountRatePct } from '@/lib/settings';

describe('settings', () => {
  it('valida la tasa entre 0 y 100', () => {
    expect(isValidRatePct(12)).toBe(true);
    expect(isValidRatePct(0)).toBe(true);
    expect(isValidRatePct(100)).toBe(true);
    expect(isValidRatePct(-1)).toBe(false);
    expect(isValidRatePct(101)).toBe(false);
    expect(isValidRatePct(NaN)).toBe(false);
  });
  it('sin localStorage disponible devuelve el valor por defecto y no lanza', () => {
    // En el entorno de pruebas (node) localStorage no existe: debe caer al valor por defecto.
    expect(getDefaultDiscountRatePct()).toBe(DEFAULT_DISCOUNT_RATE_PCT);
    expect(setDefaultDiscountRatePct(15)).toBe(false);
    expect(setDefaultDiscountRatePct(500)).toBe(false);
  });
});
