/**
 * Formato es-CO: miles con punto, decimales con coma, moneda con prefijo $.
 */

const LOCALE = 'es-CO';

/** Formatea un número como moneda colombiana: $ 1.250.000 */
export function formatCOP(n: number): string {
  if (!isFinite(n)) return '$ 0';
  const rounded = Math.round(n);
  return '$ ' + rounded.toLocaleString(LOCALE, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/** Formatea un número con separadores de miles es-CO y N decimales */
export function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n)) return '0';
  return n.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Formatea un porcentaje: 15.5 → "15,5 %" */
export function formatPercent(n: number, decimals = 2): string {
  if (!isFinite(n)) return '0 %';
  return n.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + ' %';
}

/**
 * Parsea texto en formato es-CO a número.
 * Acepta: "1.250.000", "$ 1.250.000", "1.250,50", "1250,50", "1250.50" (ambiguo → trata . como miles si hay coma)
 */
export function parseNumberEsCO(text: string): number {
  let t = text.trim();
  // Quitar símbolo $ y espacios
  t = t.replace(/\$/g, '').replace(/\s/g, '');
  if (t === '') return 0;
  // Quitar % si está al final
  t = t.replace(/%$/, '').trim();

  const hasComma = t.includes(',');
  const hasDot = t.includes('.');

  if (hasComma && hasDot) {
    // Formato es-CO: puntos = miles, coma = decimal
    t = t.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    // Solo coma → decimal
    t = t.replace(',', '.');
  } else if (hasDot) {
    // Solo punto: si hay múltiples puntos → son miles; si uno solo y ≤2 dígitos después → decimal; si no → miles
    const parts = t.split('.');
    if (parts.length > 2) {
      // Múltiples puntos → separador de miles
      t = parts.join('');
    } else if (parts.length === 2) {
      const after = parts[1];
      if (after.length <= 2) {
        // Ambiguo: tratamos como decimal (más común en entrada de usuario)
        // No modificar — ya es formato decimal con punto
      } else {
        // Un punto con >2 dígitos después → miles
        t = parts.join('');
      }
    }
  }

  const num = parseFloat(t);
  return isFinite(num) ? num : 0;
}

/** Fecha relativa en español: "hace 2 días", "hace 3 horas", "hace un momento" */
export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  if (diffHrs < 24) return `hace ${diffHrs} ${diffHrs === 1 ? 'hora' : 'horas'}`;
  if (diffDays === 1) return 'ayer';
  if (diffDays < 30) return `hace ${diffDays} días`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  const years = Math.floor(diffDays / 365);
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
}
