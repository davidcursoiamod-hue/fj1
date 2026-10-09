/**
 * Motor financiero — funciones puras.
 *
 * Convenciones:
 * - El AÑO 0 NO se descuenta (flujo del momento inicial).
 * - El año t se descuenta con (1 + r)^t, con flujos a fin de año.
 * - `rate` se recibe como fracción (0.12), no como porcentaje.
 * - Nada se redondea en el cálculo; solo al mostrar.
 */

import type { Project, CostLine, BenefitLine } from '@/data/schema';

/** Valor presente de un flujo en el año t: flow_t / (1 + r)^t */
function pv(rate: number, flow: number, t: number): number {
  return flow / Math.pow(1 + rate, t);
}

/** Valor presente neto. flows[0] es el año 0 (no se descuenta). */
export function npv(rate: number, flows: number[]): number {
  if (flows.length === 0) return 0;
  return flows.reduce((sum, flow, t) => sum + pv(rate, flow, t), 0);
}

/**
 * Tasa Interna de Retorno. Usa bisección sobre [-0.99, 10].
 * Devuelve null si no hay cambio de signo en los flujos o no converge.
 * Nota: pueden existir TIR múltiples cuando los flujos cambian de signo más de una vez.
 */
export function irr(flows: number[]): number | null {
  if (flows.length === 0) return null;

  // Verificar que haya al menos un flujo positivo y uno negativo
  const hasPositive = flows.some((f) => f > 0);
  const hasNegative = flows.some((f) => f < 0);
  if (!hasPositive || !hasNegative) return null;

  const f = (r: number) => npv(r, flows);

  // Buscar cambio de signo en el rango [-0.99, 10]
  let lo = -0.99;
  let hi = 10;
  let fLo = f(lo);
  let fHi = f(hi);

  // Si no hay cambio de signo en los extremos, intentar expandir búsqueda interna
  if (fLo * fHi > 0) {
    // Búsqueda fina para encontrar un cambio de signo
    const steps = 1000;
    let prevR = lo;
    let prevF = fLo;
    let found = false;
    for (let i = 1; i <= steps; i++) {
      const r = lo + (hi - lo) * (i / steps);
      const fr = f(r);
      if (prevF * fr < 0) {
        lo = prevR;
        hi = r;
        fLo = prevF;
        fHi = fr;
        found = true;
        break;
      }
      prevR = r;
      prevF = fr;
    }
    if (!found) return null;
  }

  // Bisección
  const maxIter = 200;
  const tolerance = 1e-10;
  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2;
    const fMid = f(mid);
    if (Math.abs(fMid) < tolerance) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
    if (hi - lo < 1e-12) return (lo + hi) / 2;
  }

  return (lo + hi) / 2;
}

/** Relación Beneficio/Costo: VP(beneficios) / VP(costos). null si VP(costos) = 0. */
export function benefitCostRatio(rate: number, benefits: number[], costs: number[]): number | null {
  if (benefits.length !== costs.length) return null;
  const vpBenefits = benefits.reduce((sum, b, t) => sum + pv(rate, b, t), 0);
  const vpCosts = costs.reduce((sum, c, t) => sum + pv(rate, c, t), 0);
  if (vpCosts === 0) return null;
  return vpBenefits / vpCosts;
}

/**
 * Período de recuperación simple: años (con fracción) hasta que el flujo acumulado ≥ 0.
 * null si nunca. Usa interpolación lineal dentro del año de recuperación.
 */
export function simplePayback(flows: number[]): number | null {
  if (flows.length === 0) return null;
  let cumulative = 0;
  for (let t = 0; t < flows.length; t++) {
    const prevCum = cumulative;
    cumulative += flows[t];
    if (cumulative >= 0 && prevCum < 0) {
      if (t === 0) return 0;
      const fraction = -prevCum / flows[t];
      return (t - 1) + fraction;
    }
    if (cumulative >= 0 && t === 0) return 0;
  }
  return null;
}

/**
 * Período de recuperación descontado: igual que simplePayback pero con flujos descontados.
 */
export function discountedPayback(rate: number, flows: number[]): number | null {
  if (flows.length === 0) return null;
  const discounted = flows.map((f, t) => pv(rate, f, t));
  let cumulative = 0;
  for (let t = 0; t < discounted.length; t++) {
    const prevCum = cumulative;
    cumulative += discounted[t];
    if (cumulative >= 0 && prevCum < 0) {
      if (t === 0) return 0;
      const fraction = -prevCum / discounted[t];
      return (t - 1) + fraction;
    }
    if (cumulative >= 0 && t === 0) return 0;
  }
  return null;
}

/**
 * Costo Anual Equivalente (CAE).
 * n = número de años después del año 0 = longitud - 1.
 * CAE = VP(costos) × r / (1 − (1+r)^−n)
 * Si r = 0: VP / n.
 */
export function equivalentAnnualCost(rate: number, costs: number[]): number | null {
  if (costs.length === 0) return null;
  const n = costs.length - 1;
  if (n <= 0) return null;
  const vpCosts = costs.reduce((sum, c, t) => sum + pv(rate, c, t), 0);
  if (rate === 0) {
    return vpCosts / n;
  }
  const factor = rate / (1 - Math.pow(1 + rate, -n));
  return vpCosts * factor;
}

/** Costo por beneficiario. null si beneficiarios ≤ 0. */
export function costPerBeneficiary(presentValueCosts: number, beneficiaries: number): number | null {
  if (beneficiaries <= 0) return null;
  return presentValueCosts / beneficiaries;
}

/** Suma los costos de una línea de costo para un año dado */
function costLineAmountForYear(line: CostLine, year: number): number {
  if (year < line.startYear || year > line.endYear) return 0;
  return line.quantityPerYear * line.unitCost;
}

/** Suma los beneficios de una línea para un año dado (con crecimiento compuesto) */
function benefitLineAmountForYear(line: BenefitLine, year: number): number {
  if (year < line.startYear || year > line.endYear) return 0;
  const elapsed = year - line.startYear;
  const growth = Math.pow(1 + line.quantityGrowthPct / 100, elapsed);
  return line.quantityPerYear * growth * line.unitValue;
}

/**
 * Construye los flujos anuales del proyecto para los años 0..horizonYears.
 * costs[t] = suma de costos de cadena de valor en año t
 * benefits[t] = suma de beneficios en año t
 * net[t] = benefits[t] - costs[t]
 */
export function buildAnnualFlows(project: Project): {
  years: number[];
  costs: number[];
  benefits: number[];
  net: number[];
} {
  const horizon = project.meta.horizonYears;
  const years: number[] = [];
  const costs: number[] = [];
  const benefits: number[] = [];
  const net: number[] = [];

  for (let t = 0; t <= horizon; t++) {
    years.push(t);

    // Costos: iterar sobre todas las líneas de costo en la cadena de valor
    let yearCost = 0;
    for (const block of project.valueChain.blocks) {
      for (const product of block.products) {
        for (const activity of product.activities) {
          for (const line of activity.costLines) {
            yearCost += costLineAmountForYear(line, t);
          }
        }
      }
    }
    costs.push(yearCost);

    // Beneficios
    let yearBenefit = 0;
    for (const line of project.benefits) {
      yearBenefit += benefitLineAmountForYear(line, t);
    }
    benefits.push(yearBenefit);

    net.push(yearBenefit - yearCost);
  }

  return { years, costs, benefits, net };
}
