import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { NumberField } from '@/components/ui/NumberField';
import { Icon } from '@/components/ui/Icon';
import type { Project, PopulationGroup } from '@/data/schema';
import { useProjectStore } from '@/store/projectStore';

const UNITS = [
  'Personas',
  'Familias',
  'Viviendas',
  'Hectáreas',
  'Unidades productivas',
  'Comunidades',
  'Veredas',
  'Otra',
];

export function PoblacionModule({ project }: { project: Project }) {
  const updateProject = useProjectStore((s) => s.updateProject);
  const population = project.population;

  function updatePopulation(patch: Partial<typeof population>) {
    updateProject({ ...project, population: { ...population, ...patch } });
  }

  function updateGroup(key: 'affected' | 'target', patch: Partial<PopulationGroup>) {
    updatePopulation({ [key]: { ...population[key], ...patch } } as Partial<typeof population>);
  }

  const coveragePct = useMemo(() => {
    if (population.affected.amount <= 0) return null;
    return Math.min(100, (population.target.amount / population.affected.amount) * 100);
  }, [population.affected.amount, population.target.amount]);

  const targetExceeds =
    population.target.amount > population.affected.amount && population.affected.amount > 0;

  return (
    <div className="mx-auto w-full max-w-content px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-4">
        <Card variant="outlined">
          <CardHeader
            title="Población afectada"
            subtitle="Personas que actualmente sufren el problema"
            icon="groups"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <NumberField
              label="Cantidad"
              value={population.affected.amount}
              onChange={(v) => updateGroup('affected', { amount: v })}
              errorText={
                population.affected.amount === 0
                  ? 'Indica la cantidad de población afectada.'
                  : undefined
              }
              helperText={
                population.affected.amount === 0
                  ? undefined
                  : 'Número de personas afectadas por el problema'
              }
            />
            <Select
              label="Unidad"
              value={population.affected.unit || undefined}
              onChange={(v) => updateGroup('affected', { unit: v })}
              options={UNITS.map((u) => ({ value: u, label: u }))}
              placeholder="Selecciona una unidad"
            />
            <TextField
              label="Fuente de los datos"
              value={population.affected.source}
              onChange={(e) => updateGroup('affected', { source: e.target.value })}
              helperText="DANE, encuesta, diagnóstico local…"
              maxLength={120}
            />
          </div>
        </Card>

        <Card variant="outlined">
          <CardHeader
            title="Población objetivo"
            subtitle="Personas que se beneficiarán directamente con el proyecto"
            icon="volunteer_activism"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <NumberField
              label="Cantidad"
              value={population.target.amount}
              onChange={(v) => updateGroup('target', { amount: v })}
              errorText={
                targetExceeds
                  ? 'La población objetivo no puede ser mayor que la afectada.'
                  : population.target.amount === 0
                    ? 'Indica la cantidad de población objetivo.'
                    : undefined
              }
              helperText={
                targetExceeds
                  ? undefined
                  : 'Número de personas que se beneficiarán'
              }
            />
            <Select
              label="Unidad"
              value={population.target.unit || undefined}
              onChange={(v) => updateGroup('target', { unit: v })}
              options={UNITS.map((u) => ({ value: u, label: u }))}
              placeholder="Selecciona una unidad"
            />
            <TextField
              label="Fuente de los datos"
              value={population.target.source}
              onChange={(e) => updateGroup('target', { source: e.target.value })}
              helperText="DANE, encuesta, proyección…"
              maxLength={120}
            />
          </div>
        </Card>

        {coveragePct !== null && (
          <CoverageBar percent={coveragePct} targetExceeds={targetExceeds} />
        )}

        <Card variant="outlined">
          <CardHeader
            title="Características socioeconómicas"
            subtitle="Contexto de la población beneficiaria"
            icon="diversity_3"
          />
          <TextArea
            label="Características"
            value={population.characteristics}
            onChange={(e) => updatePopulation({ characteristics: e.target.value })}
            helperText="Describe características relevantes: ingresos, nivel educativo, acceso a servicios, etnicidad, género, etc."
            maxLength={1000}
            showCounter
            rows={5}
          />
        </Card>
      </div>
    </div>
  );
}

function CoverageBar({ percent, targetExceeds }: { percent: number; targetExceeds: boolean }) {
  const reduced = useReducedMotion();
  const clamped = Math.min(100, percent);
  const label = targetExceeds
    ? 'La población objetivo supera a la afectada'
    : `${percent.toFixed(1)} % de cobertura`;

  const color = targetExceeds
    ? 'var(--error)'
    : percent >= 80
      ? 'var(--stage-preparation)'
      : percent >= 50
        ? 'var(--stage-evaluation)'
        : 'var(--stage-identification)';

  return (
    <Card variant="outlined">
      <CardHeader
        title="Cobertura"
        subtitle="Población objetivo como proporción de la afectada"
        icon="data_usage"
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface">{label}</span>
          <span className="text-sm font-semibold tabular-nums" style={{ color }}>
            {percent.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 rounded-pill bg-surface-highest overflow-hidden">
          <motion.div
            className="h-full rounded-pill"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={
              reduced
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 120, damping: 24 }
            }
          />
        </div>
        {targetExceeds && (
          <div className="flex items-center gap-1.5 text-sm text-error">
            <Icon name="warning" size={18} className="shrink-0" />
            <span>
              La población objetivo no debería superar a la población afectada. Revisa los valores.
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
