import { describe, it, expect } from 'vitest';
import { moduleProgress, stageProgress, overallProgress } from '@/lib/completion';
import { createEmptyProject, type Project } from '@/data/schema';

function makeProject(overrides?: Partial<Project>): Project {
  return { ...createEmptyProject(), ...overrides } as Project;
}

describe('moduleProgress — datos', () => {
  it('proyecto vacío → 17 % (horizonte por defecto cumple) con 5 faltantes', () => {
    const p = makeProject();
    const r = moduleProgress(p, 'datos');
    expect(r.percent).toBe(17);
    expect(r.missing).toHaveLength(5);
  });

  it('proyecto con todos los campos → 100 %', () => {
    const p = makeProject({
      meta: {
        name: 'Mi proyecto',
        sector: 'salud',
        entity: 'Alcaldía',
        formulator: 'Juan',
        department: 'Cauca',
        municipality: 'Popayán',
        startYear: 2026,
        horizonYears: 5,
        description: 'Una descripción',
        currency: 'COP',
      },
    });
    const r = moduleProgress(p, 'datos');
    expect(r.percent).toBe(100);
    expect(r.missing).toHaveLength(0);
  });

  it('proyecto con nombre, horizonte y descripción → 50 %', () => {
    const p = makeProject({
      meta: {
        ...createEmptyProject().meta,
        name: 'Mi proyecto',
        horizonYears: 5,
        description: 'desc',
      },
    });
    const r = moduleProgress(p, 'datos');
    expect(r.percent).toBe(50);
    expect(r.missing).toHaveLength(3);
  });
});

describe('moduleProgress — participantes', () => {
  it('sin participantes → 0 %', () => {
    const p = makeProject();
    const r = moduleProgress(p, 'participantes');
    expect(r.percent).toBe(0);
  });

  it('con beneficiario y cooperante → 100 %', () => {
    const p = makeProject({
      stakeholders: [
        { id: '1', name: 'A', kind: 'beneficiario', role: '', expectation: '', stance: 'a_favor' },
        { id: '2', name: 'B', kind: 'cooperante', role: '', expectation: '', stance: 'neutral' },
      ],
    });
    const r = moduleProgress(p, 'participantes');
    expect(r.percent).toBe(100);
  });

  it('solo beneficiario → 50 %', () => {
    const p = makeProject({
      stakeholders: [
        { id: '1', name: 'A', kind: 'beneficiario', role: '', expectation: '', stance: 'a_favor' },
      ],
    });
    const r = moduleProgress(p, 'participantes');
    expect(r.percent).toBe(50);
  });
});

describe('moduleProgress — poblacion', () => {
  it('población en cero → 0 %', () => {
    const p = makeProject();
    expect(moduleProgress(p, 'poblacion').percent).toBe(0);
  });

  it('ambas poblaciones > 0 → 100 %', () => {
    const p = makeProject({
      population: {
        affected: { amount: 100, unit: 'personas', source: 'DANE' },
        target: { amount: 80, unit: 'personas', source: 'DANE' },
        characteristics: '',
      },
    });
    expect(moduleProgress(p, 'poblacion').percent).toBe(100);
  });
});

describe('moduleProgress — problema', () => {
  it('problema central vacío, sin causas ni efectos → 0 %', () => {
    const p = makeProject();
    const r = moduleProgress(p, 'problema');
    expect(r.percent).toBe(0);
    expect(r.missing).toHaveLength(3);
  });

  it('problema con texto, 2 causas directas y 1 efecto directo → 100 %', () => {
    const centralId = 'central';
    const p = makeProject({
      problemTree: {
        centralProblemId: centralId,
        description: '',
        nodes: [
          { id: centralId, type: 'problema', level: 1, parentId: null, text: 'Baja producción', order: 0 },
          { id: 'c1', type: 'causa', level: 1, parentId: centralId, text: 'Falta insumos', order: 1 },
          { id: 'c2', type: 'causa', level: 1, parentId: centralId, text: 'Poca agua', order: 2 },
          { id: 'e1', type: 'efecto', level: 1, parentId: centralId, text: 'Bajos ingresos', order: 3 },
        ],
      },
    });
    expect(moduleProgress(p, 'problema').percent).toBe(100);
  });

  it('problema con texto pero solo 1 causa → 67 %', () => {
    const centralId = 'central';
    const p = makeProject({
      problemTree: {
        centralProblemId: centralId,
        description: '',
        nodes: [
          { id: centralId, type: 'problema', level: 1, parentId: null, text: 'Baja producción', order: 0 },
          { id: 'c1', type: 'causa', level: 1, parentId: centralId, text: 'Falta insumos', order: 1 },
          { id: 'e1', type: 'efecto', level: 1, parentId: centralId, text: 'Bajos ingresos', order: 2 },
        ],
      },
    });
    const r = moduleProgress(p, 'problema');
    expect(r.percent).toBe(67);
  });
});

describe('moduleProgress — objetivos', () => {
  it('sin nodos → 0 %', () => {
    const p = makeProject();
    expect(moduleProgress(p, 'objetivos').percent).toBe(0);
  });

  it('con nodos y ninguno con needsReview → 100 %', () => {
    const p = makeProject({
      objectiveTree: {
        nodes: [
          { id: 'o1', sourceNodeId: 's1', type: 'general', parentId: null, text: 'Aumentar producción', order: 0, manuallyEdited: false, needsReview: false },
        ],
      },
    });
    expect(moduleProgress(p, 'objetivos').percent).toBe(100);
  });

  it('con nodos pero alguno con needsReview → 50 %', () => {
    const p = makeProject({
      objectiveTree: {
        nodes: [
          { id: 'o1', sourceNodeId: 's1', type: 'general', parentId: null, text: 'Obj 1', order: 0, manuallyEdited: false, needsReview: false },
          { id: 'o2', sourceNodeId: 's2', type: 'especifico', parentId: 'o1', text: 'Obj 2', order: 1, manuallyEdited: false, needsReview: true },
        ],
      },
    });
    expect(moduleProgress(p, 'objetivos').percent).toBe(50);
  });
});

describe('moduleProgress — módulo no implementado', () => {
  it('devuelve 0 % con "Módulo aún no disponible"', () => {
    const p = makeProject();
    const r = moduleProgress(p, 'mercado');
    expect(r.percent).toBe(0);
    expect(r.missing).toEqual(['Módulo aún no disponible']);
  });
});

describe('stageProgress', () => {
  it('etapa identification con proyecto vacío', () => {
    const p = makeProject();
    const r = stageProgress(p, 'identification');
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(100);
  });

  it('etapa preparation con proyecto vacío → 0', () => {
    const p = makeProject();
    expect(stageProgress(p, 'preparation')).toBe(0);
  });
});

describe('overallProgress', () => {
  it('proyecto vacío → valor entre 0 y 100', () => {
    const p = makeProject();
    const r = overallProgress(p);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(100);
  });

  it('proyecto completo en datos y participantes → mayor que proyecto vacío', () => {
    const empty = makeProject();
    const filled = makeProject({
      meta: {
        name: 'Mi proyecto',
        sector: 'salud',
        entity: 'Alcaldía',
        formulator: 'Juan',
        department: 'Cauca',
        municipality: 'Popayán',
        startYear: 2026,
        horizonYears: 5,
        description: 'desc',
        currency: 'COP',
      },
      stakeholders: [
        { id: '1', name: 'A', kind: 'beneficiario', role: '', expectation: '', stance: 'a_favor' },
        { id: '2', name: 'B', kind: 'cooperante', role: '', expectation: '', stance: 'neutral' },
      ],
    });
    expect(overallProgress(filled)).toBeGreaterThan(overallProgress(empty));
  });
});
