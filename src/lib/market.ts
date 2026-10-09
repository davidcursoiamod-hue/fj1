/**
 * Proyección de mercado — función pura.
 */

/**
 * Proyecta una serie geométrica año a año.
 * @param base Valor en el año 0
 * @param growthPct Porcentaje de crecimiento anual (5 = 5%)
 * @param years Número de años a proyectar (incluye año 0)
 * @returns Array de longitud years+1 con valor[k] = base × (1 + g)^k
 */
export function projectSeries(base: number, growthPct: number, years: number): number[] {
  const g = growthPct / 100;
  const result: number[] = [];
  for (let k = 0; k <= years; k++) {
    result.push(base * Math.pow(1 + g, k));
  }
  return result;
}

/** Déficit = demanda − oferta (positivo = demanda insatisfecha) */
export function deficit(demand: number, supply: number): number {
  return demand - supply;
}

/** Cobertura = oferta / demanda (null si demanda = 0) */
export function coverage(supply: number, demand: number): number | null {
  if (demand === 0) return null;
  return supply / demand;
}

/**
 * Proyecta demanda y oferta a lo largo de los años y calcula déficit y cobertura por año.
 */
export function projectMarket(
  demandBase: number,
  supplyBase: number,
  demandGrowthPct: number,
  supplyGrowthPct: number,
  years: number,
): {
  demand: number[];
  supply: number[];
  deficit: number[];
  coverage: (number | null)[];
} {
  const demand = projectSeries(demandBase, demandGrowthPct, years);
  const supply = projectSeries(supplyBase, supplyGrowthPct, years);
  const deficitArr = demand.map((d, i) => deficit(d, supply[i]));
  const coverageArr = demand.map((d, i) => coverage(supply[i], d));
  return { demand, supply, deficit: deficitArr, coverage: coverageArr };
}
