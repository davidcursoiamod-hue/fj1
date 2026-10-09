/**
 * Preferencias del usuario guardadas en localStorage.
 * Toda lectura y escritura va dentro de try/catch: el almacenamiento puede
 * estar bloqueado (modo privado, datos de sitio deshabilitados).
 */

export const DEFAULT_DISCOUNT_RATE_PCT = 12;
const RATE_KEY = 'formula-default-discount-rate';

export function isValidRatePct(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

export function getDefaultDiscountRatePct(): number {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    if (raw === null) return DEFAULT_DISCOUNT_RATE_PCT;
    const n = Number(raw);
    return isValidRatePct(n) ? n : DEFAULT_DISCOUNT_RATE_PCT;
  } catch {
    return DEFAULT_DISCOUNT_RATE_PCT;
  }
}

/** Devuelve false si el valor no es válido o no se pudo guardar. */
export function setDefaultDiscountRatePct(value: number): boolean {
  if (!isValidRatePct(value)) return false;
  try {
    localStorage.setItem(RATE_KEY, String(value));
    return true;
  } catch {
    return false;
  }
}
