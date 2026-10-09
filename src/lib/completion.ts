import type { Project } from '@/data/schema';
import { MODULES, STAGES, type StageId } from '@/config';

export interface ModuleProgress {
  percent: number;
  missing: string[];
}

interface Check {
  label: string;
  done: boolean;
}

// ---- Reglas por módulo ----

function checkDatos(project: Project): Check[] {
  const m = project.meta;
  return [
    { label: 'Nombre', done: m.name.trim() !== '' && m.name !== 'Proyecto sin nombre' },
    { label: 'Sector', done: m.sector.trim() !== '' },
    { label: 'Entidad responsable', done: m.entity.trim() !== '' },
    { label: 'Municipio', done: m.municipality.trim() !== '' },
    { label: 'Horizonte de evaluación', done: m.horizonYears > 0 },
    { label: 'Descripción', done: m.description.trim() !== '' },
  ];
}

function checkParticipantes(project: Project): Check[] {
  const beneficiarios = project.stakeholders.filter((s) => s.kind === 'beneficiario');
  const cooperantes = project.stakeholders.filter((s) => s.kind === 'cooperante');
  return [
    { label: 'Al menos un beneficiario', done: beneficiarios.length >= 1 },
    { label: 'Al menos un cooperante', done: cooperantes.length >= 1 },
  ];
}

function checkPoblacion(project: Project): Check[] {
  return [
    { label: 'Población afectada con cantidad mayor que cero', done: project.population.affected.amount > 0 },
    { label: 'Población objetivo con cantidad mayor que cero', done: project.population.target.amount > 0 },
  ];
}

function checkProblema(project: Project): Check[] {
  const central = project.problemTree.nodes.find(
    (n) => n.id === project.problemTree.centralProblemId,
  );
  const causasDirectas = project.problemTree.nodes.filter(
    (n) => n.type === 'causa' && n.level === 1,
  );
  const efectosDirectos = project.problemTree.nodes.filter(
    (n) => n.type === 'efecto' && n.level === 1,
  );
  return [
    { label: 'Problema central definido', done: Boolean(central && central.text.trim() !== '') },
    { label: 'Al menos dos causas directas', done: causasDirectas.length >= 2 },
    { label: 'Al menos un efecto directo', done: efectosDirectos.length >= 1 },
  ];
}

function checkObjetivos(project: Project): Check[] {
  const nodes = project.objectiveTree.nodes;
  const hasNodes = nodes.length >= 1;
  const noneNeedsReview = hasNodes && nodes.every((n) => !n.needsReview);
  return [
    { label: 'Al menos un objetivo generado', done: hasNodes },
    { label: 'Ningún nodo pendiente de revisión', done: noneNeedsReview },
  ];
}

const RULES: Record<string, (project: Project) => Check[]> = {
  datos: checkDatos,
  participantes: checkParticipantes,
  poblacion: checkPoblacion,
  problema: checkProblema,
  objetivos: checkObjetivos,
};

/** Progreso de un módulo: porcentaje y lista de condiciones faltantes. */
export function moduleProgress(project: Project, slug: string): ModuleProgress {
  const rule = RULES[slug];
  if (!rule) {
    return { percent: 0, missing: ['Módulo aún no disponible'] };
  }
  const checks = rule(project);
  const total = checks.length;
  const done = checks.filter((c) => c.done).length;
  const missing = checks.filter((c) => !c.done).map((c) => c.label);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { percent, missing };
}

/** Progreso promedio de una etapa (promedio de los porcentajes de sus módulos). */
export function stageProgress(project: Project, stageId: StageId): number {
  const mods = MODULES.filter((m) => m.stage === stageId);
  if (mods.length === 0) return 0;
  const sum = mods.reduce((acc, m) => acc + moduleProgress(project, m.slug).percent, 0);
  return Math.round(sum / mods.length);
}

/** Progreso global: promedio de todos los módulos del listado MODULES. */
export function overallProgress(project: Project): number {
  if (MODULES.length === 0) return 0;
  const sum = MODULES.reduce((acc, m) => acc + moduleProgress(project, m.slug).percent, 0);
  return Math.round(sum / MODULES.length);
}

/** Progreso por etapa como arreglo de { stage, percent } para las mini-barras. */
export function stageProgressAll(project: Project): { stageId: StageId; percent: number; colorVar: string }[] {
  return STAGES.map((s) => ({
    stageId: s.id,
    percent: stageProgress(project, s.id),
    colorVar: s.colorVar,
  }));
}
