export const APP_NAME = 'Formula';
export const APP_VERSION = '0.1.0';
export const AUTHOR = 'Francisco Javier Gonzalez Mejia';

export type StageId = 'identification' | 'preparation' | 'evaluation' | 'programming';

export interface StageDef {
  id: StageId;
  name: string;
  colorClass: string;
  containerClass: string;
  onClass: string;
  onContainerClass: string;
  colorVar: string;
}

export interface ModuleDef {
  slug: string;
  name: string;
  stage: StageId | 'summary';
  helpTitle: string;
  helpText: string;
}

export const STAGES: StageDef[] = [
  {
    id: 'identification',
    name: 'Identificación',
    colorClass: 'text-stage-identification',
    containerClass: 'bg-stage-identification-container',
    onClass: 'text-stage-identification-on',
    onContainerClass: 'text-stage-identification-on-container',
    colorVar: 'var(--stage-identification)',
  },
  {
    id: 'preparation',
    name: 'Preparación',
    colorClass: 'text-stage-preparation',
    containerClass: 'bg-stage-preparation-container',
    onClass: 'text-stage-preparation-on',
    onContainerClass: 'text-stage-preparation-on-container',
    colorVar: 'var(--stage-preparation)',
  },
  {
    id: 'evaluation',
    name: 'Evaluación',
    colorClass: 'text-stage-evaluation',
    containerClass: 'bg-stage-evaluation-container',
    onClass: 'text-stage-evaluation-on',
    onContainerClass: 'text-stage-evaluation-on-container',
    colorVar: 'var(--stage-evaluation)',
  },
  {
    id: 'programming',
    name: 'Programación',
    colorClass: 'text-stage-programming',
    containerClass: 'bg-stage-programming-container',
    onClass: 'text-stage-programming-on',
    onContainerClass: 'text-stage-programming-on-container',
    colorVar: 'var(--stage-programming)',
  },
];

export const MODULES: ModuleDef[] = [
  {
    slug: 'datos',
    name: 'Datos generales',
    stage: 'identification',
    helpTitle: 'Datos generales del proyecto',
    helpText: 'Aquí registras el nombre, la descripción, el sector, la entidad responsable y la localización del proyecto. Es la portada de tu formulación.',
  },
  {
    slug: 'participantes',
    name: 'Participantes',
    stage: 'identification',
    helpTitle: 'Participantes y stakeholders',
    helpText: 'Identifica a las personas, comunidades y entidades que participan o se ven afectadas por el proyecto, su rol y su nivel de influencia.',
  },
  {
    slug: 'poblacion',
    name: 'Población beneficiaria',
    stage: 'identification',
    helpTitle: 'Población beneficiaria',
    helpText: 'Define cuántas personas se beneficiarán, sus características socioeconómicas y cómo se distribuyen geográficamente.',
  },
  {
    slug: 'problema',
    name: 'Árbol de problemas',
    stage: 'identification',
    helpTitle: 'Árbol de problemas',
    helpText: 'Construye el árbol de problemas: el problema central en el tronco, las causas en las raíces y los efectos en las ramas.',
  },
  {
    slug: 'objetivos',
    name: 'Árbol de objetivos',
    stage: 'identification',
    helpTitle: 'Árbol de objetivos',
    helpText: 'Transforma el árbol de problemas en objetivos: el problema se vuelve fin, las causas se vuelven medios y los efectos se vuelven propósitos.',
  },
  {
    slug: 'mercado',
    name: 'Análisis de mercado',
    stage: 'preparation',
    helpTitle: 'Análisis de mercado',
    helpText: 'Estudia la demanda, la oferta, los precios y la comercialización del bien o servicio que generará el proyecto.',
  },
  {
    slug: 'cadena-valor',
    name: 'Cadena de valor',
    stage: 'preparation',
    helpTitle: 'Cadena de valor',
    helpText: 'Mapea el proceso productivo: insumos, producción, transformación y distribución del bien o servicio.',
  },
  {
    slug: 'riesgos',
    name: 'Identificación de riesgos',
    stage: 'preparation',
    helpTitle: 'Identificación de riesgos',
    helpText: 'Identifica los riesgos del proyecto, su probabilidad, impacto y las medidas de mitigación propuestas.',
  },
  {
    slug: 'ingresos',
    name: 'Ingresos y beneficios',
    stage: 'preparation',
    helpTitle: 'Ingresos y beneficios',
    helpText: 'Cuantifica los ingresos y beneficios del proyecto a lo largo del horizonte de evaluación.',
  },
  {
    slug: 'flujo',
    name: 'Flujo de caja',
    stage: 'evaluation',
    helpTitle: 'Flujo de caja',
    helpText: 'Construye el flujo de caja con inversiones, costos de operación, mantenimiento e ingresos año a año.',
  },
  {
    slug: 'indicadores',
    name: 'Indicadores',
    stage: 'evaluation',
    helpTitle: 'Indicadores de evaluación',
    helpText: 'Calcula el VPN, la TIR y la relación Beneficio/Costo para determinar la viabilidad financiera del proyecto.',
  },
  {
    slug: 'financiacion',
    name: 'Financiación',
    stage: 'programming',
    helpTitle: 'Financiación',
    helpText: 'Define las fuentes de financiación: recursos propios, crédito, cooperación y aportes de entidades.',
  },
  {
    slug: 'cronograma',
    name: 'Cronograma',
    stage: 'programming',
    helpTitle: 'Cronograma del proyecto',
    helpText: 'Programa las actividades del proyecto en el tiempo: inversión, ejecución, operación y evaluación.',
  },
  {
    slug: 'resumen',
    name: 'Resumen del proyecto',
    stage: 'summary',
    helpTitle: 'Resumen ejecutivo',
    helpText: 'Consolidado de toda la formulación: el problema, el objetivo, los beneficios, los costos y los indicadores de viabilidad.',
  },
];

export function getModule(slug: string): ModuleDef | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getStage(id: StageId): StageDef | undefined {
  return STAGES.find((s) => s.id === id);
}

export function getModulesByStage(stageId: StageId): ModuleDef[] {
  return MODULES.filter((m) => m.stage === stageId);
}

export const STAGE_OF_MODULE: Record<string, StageDef | undefined> = MODULES.reduce(
  (acc, m) => {
    if (m.stage !== 'summary') {
      acc[m.slug] = getStage(m.stage);
    }
    return acc;
  },
  {} as Record<string, StageDef | undefined>,
);
