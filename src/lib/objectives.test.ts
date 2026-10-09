import { describe, it, expect } from 'vitest';
import { toPositive } from '@/lib/objectives';

const cases: { input: string; expected: string; confidence?: 'high' | 'low' }[] = [
  { input: 'Baja productividad de los cultivos de trucha', expected: 'Aumentar la productividad de los cultivos de trucha' },
  { input: 'Bajo consumo local de trucha', expected: 'Aumentar el consumo local de trucha' },
  { input: 'Bajos ingresos de las familias productoras', expected: 'Aumentar los ingresos de las familias productoras' },
  { input: 'Escasa asistencia técnica', expected: 'Aumentar la asistencia técnica' },
  { input: 'Infraestructura de estanques deficiente', expected: 'Mejorar la infraestructura de estanques' },
  { input: 'Alto costo del alimento concentrado', expected: 'Disminuir el costo del alimento concentrado' },
  { input: 'Desconocimiento de las propiedades nutricionales de la trucha', expected: 'Aumentar el conocimiento de las propiedades nutricionales de la trucha' },
  { input: 'Pocos puntos de venta formales', expected: 'Aumentar los puntos de venta formales' },
  { input: 'Dificultad para comercializar la trucha', expected: 'Disminuir la dificultad para comercializar la trucha' },
  { input: 'Pérdidas de producción', expected: 'Reducir las pérdidas de producción' },
  { input: 'Aumento de la pobreza rural', expected: 'Reducir la pobreza rural' },
  { input: 'Desmotivación para continuar con la actividad', expected: 'Aumentar la motivación para continuar con la actividad' },
  { input: 'Falta de asistencia técnica', expected: 'Contar con asistencia técnica' },
  { input: 'Trámites de concesión de aguas complejos', expected: 'Simplificar los trámites de concesión de aguas' },
  { input: 'Cultivos afectados por enfermedades', expected: 'Superar: Cultivos afectados por enfermedades', confidence: 'low' },
];

describe('toPositive', () => {
  for (const c of cases) {
    it(`"${c.input}" → "${c.expected}"`, () => {
      const result = toPositive(c.input);
      expect(result.text).toBe(c.expected);
      if (c.confidence) {
        expect(result.confidence).toBe(c.confidence);
      }
    });
  }
});
