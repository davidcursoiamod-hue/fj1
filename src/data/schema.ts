import { z } from 'zod';

export const SCHEMA_VERSION = 1;

export type ID = string;
export type Stage = 'identificacion' | 'preparacion' | 'evaluacion' | 'programacion';

// ---- Zod schemas ----

export const projectMetaSchema = z.object({
  name: z.string().min(1),
  sector: z.string(),
  entity: z.string(),
  formulator: z.string(),
  department: z.string(),
  municipality: z.string(),
  startYear: z.number().int().min(2000).max(2100),
  horizonYears: z.number().int().min(1).max(20),
  description: z.string(),
  currency: z.literal('COP'),
});
export type ProjectMeta = z.infer<typeof projectMetaSchema>;

export const stakeholderKindSchema = z.enum([
  'beneficiario', 'cooperante', 'perjudicado', 'oponente', 'regulador',
]);
export type StakeholderKind = z.infer<typeof stakeholderKindSchema>;

export const stakeholderSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: stakeholderKindSchema,
  role: z.string(),
  expectation: z.string(),
  stance: z.enum(['a_favor', 'neutral', 'en_contra']),
});
export type Stakeholder = z.infer<typeof stakeholderSchema>;

export const populationGroupSchema = z.object({
  amount: z.number().min(0),
  unit: z.string(),
  source: z.string(),
});
export type PopulationGroup = z.infer<typeof populationGroupSchema>;

export const populationSchema = z.object({
  affected: populationGroupSchema,
  target: populationGroupSchema,
  characteristics: z.string(),
});
export type Population = z.infer<typeof populationSchema>;

export const problemNodeTypeSchema = z.enum(['problema', 'causa', 'efecto']);
export type ProblemNodeType = z.infer<typeof problemNodeTypeSchema>;

export const problemNodeSchema = z.object({
  id: z.string(),
  type: problemNodeTypeSchema,
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  parentId: z.string().nullable(),
  text: z.string(),
  order: z.number(),
});
export type ProblemNode = z.infer<typeof problemNodeSchema>;

export const problemTreeSchema = z.object({
  centralProblemId: z.string(),
  nodes: z.array(problemNodeSchema),
  description: z.string(),
});
export type ProblemTree = z.infer<typeof problemTreeSchema>;

export const objectiveNodeTypeSchema = z.enum([
  'general', 'especifico', 'medio', 'fin_directo', 'fin_indirecto', 'fin_ultimo',
]);
export type ObjectiveNodeType = z.infer<typeof objectiveNodeTypeSchema>;

export const objectiveNodeSchema = z.object({
  id: z.string(),
  sourceNodeId: z.string(),
  type: objectiveNodeTypeSchema,
  parentId: z.string().nullable(),
  text: z.string(),
  order: z.number(),
  manuallyEdited: z.boolean(),
  needsReview: z.boolean(),
});
export type ObjectiveNode = z.infer<typeof objectiveNodeSchema>;

export const objectiveTreeSchema = z.object({
  nodes: z.array(objectiveNodeSchema),
  generatedAt: z.string().optional(),
});
export type ObjectiveTree = z.infer<typeof objectiveTreeSchema>;

export const marketStudySchema = z.object({
  good: z.string(),
  unit: z.string(),
  baseYear: z.number().int(),
  demandBase: z.number().min(0),
  supplyBase: z.number().min(0),
  demandGrowthPct: z.number(),
  supplyGrowthPct: z.number(),
  notes: z.string(),
});
export type MarketStudy = z.infer<typeof marketStudySchema>;

export const costTypeSchema = z.enum([
  'mano_obra', 'materiales', 'equipos', 'servicios', 'otros',
]);
export type CostType = z.infer<typeof costTypeSchema>;

export const costLineSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: costTypeSchema,
  unit: z.string(),
  startYear: z.number().int().min(0),
  endYear: z.number().int().min(0),
  quantityPerYear: z.number().min(0),
  unitCost: z.number().min(0),
});
export type CostLine = z.infer<typeof costLineSchema>;

export const activitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  costLines: z.array(costLineSchema),
});
export type Activity = z.infer<typeof activitySchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  indicatorUnit: z.string(),
  goalQuantity: z.number().min(0),
  activities: z.array(activitySchema),
});
export type Product = z.infer<typeof productSchema>;

export const specificObjectiveBlockSchema = z.object({
  id: z.string(),
  objectiveNodeId: z.string(),
  products: z.array(productSchema),
});
export type SpecificObjectiveBlock = z.infer<typeof specificObjectiveBlockSchema>;

export const valueChainSchema = z.object({
  blocks: z.array(specificObjectiveBlockSchema),
});
export type ValueChain = z.infer<typeof valueChainSchema>;

export const riskLevelSchema = z.enum(['fin', 'proposito', 'componente', 'actividad']);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

export const riskSchema = z.object({
  id: z.string(),
  level: riskLevelSchema,
  type: z.string(),
  description: z.string(),
  probability: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]),
  impact: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]),
  effects: z.string(),
  mitigation: z.string(),
});
export type Risk = z.infer<typeof riskSchema>;

export const benefitLineSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(['ingreso', 'beneficio']),
  unit: z.string(),
  startYear: z.number().int().min(0),
  endYear: z.number().int().min(0),
  quantityPerYear: z.number().min(0),
  unitValue: z.number().min(0),
  quantityGrowthPct: z.number(),
});
export type BenefitLine = z.infer<typeof benefitLineSchema>;

export const financeSettingsSchema = z.object({
  discountRatePct: z.number().min(0).max(100),
});
export type FinanceSettings = z.infer<typeof financeSettingsSchema>;

export const indicatorRowSchema = z.object({
  id: z.string(),
  level: z.enum(['fin', 'proposito', 'componente', 'actividad']),
  refId: z.string().optional(),
  narrative: z.string(),
  indicator: z.string(),
  formula: z.string(),
  unit: z.string(),
  baseline: z.string(),
  target: z.string(),
  verification: z.string(),
  assumptions: z.string(),
});
export type IndicatorRow = z.infer<typeof indicatorRowSchema>;

export const fundingKindSchema = z.enum([
  'nacion', 'departamento', 'municipio', 'sgr', 'privado', 'cooperacion', 'propios',
]);
export type FundingKind = z.infer<typeof fundingKindSchema>;

export const fundingSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: fundingKindSchema,
  amountsByYear: z.record(z.string(), z.number()),
});
export type FundingSource = z.infer<typeof fundingSourceSchema>;

export const fundingPlanSchema = z.object({
  sources: z.array(fundingSourceSchema),
});
export type FundingPlan = z.infer<typeof fundingPlanSchema>;

export const scheduleItemSchema = z.object({
  activityId: z.string(),
  startMonth: z.number().int().min(1),
  durationMonths: z.number().int().min(1),
});
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;

export const projectSchema = z.object({
  id: z.string(),
  schemaVersion: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  meta: projectMetaSchema,
  stakeholders: z.array(stakeholderSchema),
  population: populationSchema,
  problemTree: problemTreeSchema,
  objectiveTree: objectiveTreeSchema,
  market: marketStudySchema,
  valueChain: valueChainSchema,
  risks: z.array(riskSchema),
  benefits: z.array(benefitLineSchema),
  finance: financeSettingsSchema,
  indicators: z.array(indicatorRowSchema),
  funding: fundingPlanSchema,
  schedule: z.array(scheduleItemSchema),
  lastExportedAt: z.string().optional(),
});
export type Project = z.infer<typeof projectSchema>;

// ---- Summary type (for lists) ----

export interface ProjectSummary {
  id: ID;
  name: string;
  sector: string;
  municipality: string;
  updatedAt: string;
  lastExportedAt?: string;
}

export function toSummary(p: Project): ProjectSummary {
  return {
    id: p.id,
    name: p.meta.name,
    sector: p.meta.sector,
    municipality: p.meta.municipality,
    updatedAt: p.updatedAt,
    lastExportedAt: p.lastExportedAt,
  };
}

// ---- Factory ----

export function createEmptyProject(meta?: Partial<ProjectMeta>): Project {
  const now = new Date().toISOString();
  const centralId = crypto.randomUUID();
  return {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    meta: {
      name: meta?.name ?? 'Proyecto sin nombre',
      sector: meta?.sector ?? '',
      entity: meta?.entity ?? '',
      formulator: meta?.formulator ?? '',
      department: meta?.department ?? '',
      municipality: meta?.municipality ?? '',
      startYear: meta?.startYear ?? new Date().getFullYear(),
      horizonYears: meta?.horizonYears ?? 5,
      description: meta?.description ?? '',
      currency: 'COP',
    },
    stakeholders: [],
    population: {
      affected: { amount: 0, unit: '', source: '' },
      target: { amount: 0, unit: '', source: '' },
      characteristics: '',
    },
    problemTree: {
      centralProblemId: centralId,
      nodes: [
        {
          id: centralId,
          type: 'problema',
          level: 1,
          parentId: null,
          text: '',
          order: 0,
        },
      ],
      description: '',
    },
    objectiveTree: {
      nodes: [],
    },
    market: {
      good: '',
      unit: '',
      baseYear: new Date().getFullYear(),
      demandBase: 0,
      supplyBase: 0,
      demandGrowthPct: 0,
      supplyGrowthPct: 0,
      notes: '',
    },
    valueChain: { blocks: [] },
    risks: [],
    benefits: [],
    finance: { discountRatePct: 12 },
    indicators: [],
    funding: { sources: [] },
    schedule: [],
  };
}
