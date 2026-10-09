import { describe, it, expect } from 'vitest';
import { projectSeries, deficit, coverage, projectMarket } from '@/lib/market';

describe('projectSeries', () => {
  it('base=1200, g=5%, 5 años → [1200, 1260, 1323, 1389.15, 1458.6075, 1531.537875]', () => {
    const result = projectSeries(1200, 5, 5);
    expect(result).toHaveLength(6);
    expect(result[0]).toBe(1200);
    expect(result[1]).toBe(1260);
    expect(result[2]).toBe(1323);
    expect(result[3]).toBeCloseTo(1389.15, 2);
    expect(result[4]).toBeCloseTo(1458.6075, 4);
    expect(result[5]).toBeCloseTo(1531.537875, 6);
  });

  it('g=0 → todos iguales a la base', () => {
    const result = projectSeries(1000, 0, 3);
    expect(result).toEqual([1000, 1000, 1000, 1000]);
  });

  it('g negativo → decreciente', () => {
    const result = projectSeries(1000, -10, 2);
    expect(result[0]).toBe(1000);
    expect(result[1]).toBe(900);
    expect(result[2]).toBe(810);
  });
});

describe('deficit', () => {
  it('demanda > oferta → positivo (demanda insatisfecha)', () => {
    expect(deficit(1000, 600)).toBe(400);
  });
  it('demanda < oferta → negativo (exceso)', () => {
    expect(deficit(600, 1000)).toBe(-400);
  });
});

describe('coverage', () => {
  it('oferta/demanda', () => {
    expect(coverage(500, 1000)).toBe(0.5);
  });
  it('demanda = 0 → null', () => {
    expect(coverage(500, 0)).toBeNull();
  });
});

describe('projectMarket', () => {
  it('proyecta demanda, oferta, déficit y cobertura', () => {
    const result = projectMarket(1000, 500, 10, 5, 3);
    expect(result.demand).toHaveLength(4);
    expect(result.supply).toHaveLength(4);
    expect(result.deficit[0]).toBe(500);
    expect(result.coverage[0]).toBe(0.5);
  });
});
