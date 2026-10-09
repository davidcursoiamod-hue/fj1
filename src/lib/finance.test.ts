import { describe, it, expect } from 'vitest';
import {
  npv, irr, benefitCostRatio, simplePayback,
  discountedPayback, equivalentAnnualCost, costPerBeneficiary,
} from '@/lib/finance';


describe('npv', () => {
  it('Caso A: rate=0.12, flujos netos [-100M, 30M×5] → VPN = 8143286.07', () => {
    const flows = [-100000000, 30000000, 30000000, 30000000, 30000000, 30000000];
    const result = npv(0.12, flows);
    expect(result).toBeCloseTo(8143286.07, 0);
  });

  it('flujo vacío → 0', () => {
    expect(npv(0.12, [])).toBe(0);
  });

  it('tasa 0 → suma simple', () => {
    expect(npv(0, [100, 200, 300])).toBe(600);
  });
});

describe('irr', () => {
  it('Caso A: TIR ≈ 15.2382%', () => {
    const flows = [-100000000, 30000000, 30000000, 30000000, 30000000, 30000000];
    const result = irr(flows);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(0.152382, 4);
  });

  it('flujos todos cero → null', () => {
    expect(irr([0, 0, 0, 0])).toBeNull();
  });

  it('flujos todos positivos → null', () => {
    expect(irr([100, 200, 300])).toBeNull();
  });

  it('arreglo vacío → null', () => {
    expect(irr([])).toBeNull();
  });
});

describe('benefitCostRatio', () => {
  it('Caso A: VP beneficios / VP costos = 1.0632', () => {
    const rate = 0.12;
    const benefits = [0, 38000000, 38000000, 38000000, 38000000, 38000000];
    const costs = [100000000, 8000000, 8000000, 8000000, 8000000, 8000000];
    const result = benefitCostRatio(rate, benefits, costs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(1.0632, 3);
  });

  it('VP costos = 0 → null', () => {
    expect(benefitCostRatio(0.12, [100, 200], [0, 0])).toBeNull();
  });
});

describe('simplePayback', () => {
  it('Caso A: 3.3333 años', () => {
    const flows = [-100000000, 30000000, 30000000, 30000000, 30000000, 30000000];
    const result = simplePayback(flows);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(3 + 10 / 30, 3);
  });

  it('nunca recupera → null', () => {
    expect(simplePayback([-100, 10, 10, 10])).toBeNull();
  });

  it('recupera en año 0', () => {
    expect(simplePayback([100, 50, 50])).toBe(0);
  });
});

describe('discountedPayback', () => {
  it('Caso A: ≈ 4.5217 años', () => {
    const flows = [-100000000, 30000000, 30000000, 30000000, 30000000, 30000000];
    const result = discountedPayback(0.12, flows);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(4.5217, 2);
  });

  it('nunca recupera → null', () => {
    expect(discountedPayback(0.12, [-100, 10, 10, 10])).toBeNull();
  });
});

describe('equivalentAnnualCost', () => {
  it('Caso B: VP costos=90373493.47, n=4 → CAE=29754066.18', () => {
    const costs = [60000000, 10000000, 10000000, 10000000, 10000000];
    const result = equivalentAnnualCost(0.12, costs);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(29754066.18, 0);
  });

  it('r=0 → VP/n', () => {
    const costs = [100, 50, 50, 50, 50];
    expect(equivalentAnnualCost(0, costs)).toBe(300 / 4);
  });

  it('arreglo vacío → null', () => {
    expect(equivalentAnnualCost(0.12, [])).toBeNull();
  });
});

describe('costPerBeneficiary', () => {
  it('Caso B: 90373493.47 / 120 = 753112.45', () => {
    const result = costPerBeneficiary(90373493.47, 120);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(753112.45, 0);
  });

  it('beneficiarios = 0 → null', () => {
    expect(costPerBeneficiary(1000000, 0)).toBeNull();
  });

  it('beneficiarios negativos → null', () => {
    expect(costPerBeneficiary(1000000, -10)).toBeNull();
  });
});
