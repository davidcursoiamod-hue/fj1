import { useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SECTORS } from '@/lib/sectors';
import type { Project, ProjectMeta } from '@/data/schema';
import { useProjectStore } from '@/store/projectStore';

const DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
  'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
  'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
  'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
  'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada', 'Bogotá D.C.',
];

export function DatosModule({ project }: { project: Project }) {
  const updateProject = useProjectStore((s) => s.updateProject);
  const meta = project.meta;

  function updateMeta(patch: Partial<ProjectMeta>) {
    updateProject({ ...project, meta: { ...meta, ...patch } });
  }

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (meta.name.trim() === '' || meta.name === 'Proyecto sin nombre') {
      e.name = 'Escribe un nombre para el proyecto.';
    }
    if (meta.entity.trim() === '') {
      e.entity = 'Indica la entidad responsable del proyecto.';
    }
    if (meta.municipality.trim() === '') {
      e.municipality = 'Indica el municipio donde se ejecutará el proyecto.';
    }
    if (meta.department.trim() === '') {
      e.department = 'Indica el departamento.';
    }
    if (meta.description.trim() === '') {
      e.description = 'Añade una descripción breve del proyecto.';
    }
    return e;
  }, [meta]);

  const errorCount = Object.keys(errors).length;

  return (
    <div className="mx-auto w-full max-w-content px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-4">
        <Card variant="outlined">
          <CardHeader title="Identificación del proyecto" subtitle="Información básica" icon="badge" />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Nombre del proyecto"
              value={meta.name === 'Proyecto sin nombre' ? '' : meta.name}
              onChange={(e) => updateMeta({ name: e.target.value })}
              errorText={errors.name}
              maxLength={150}
              showCounter
            />
            <Select
              label="Sector"
              value={meta.sector || undefined}
              onChange={(v) => updateMeta({ sector: v })}
              options={SECTORS.map((s) => ({ value: s, label: s }))}
              placeholder="Selecciona un sector"
              helperText="Sector principal del proyecto"
            />
          </div>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Entidad y localización" subtitle="Quién formula y dónde se ejecuta" icon="location_on" />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Entidad responsable"
              value={meta.entity}
              onChange={(e) => updateMeta({ entity: e.target.value })}
              errorText={errors.entity}
              maxLength={120}
            />
            <TextField
              label="Formulador(a)"
              value={meta.formulator}
              onChange={(e) => updateMeta({ formulator: e.target.value })}
              helperText="Nombre de la persona que formula el proyecto"
              maxLength={120}
            />
            <Select
              label="Departamento"
              value={meta.department || undefined}
              onChange={(v) => updateMeta({ department: v })}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              placeholder="Selecciona un departamento"
              errorText={errors.department}
            />
            <TextField
              label="Municipio"
              value={meta.municipality}
              onChange={(e) => updateMeta({ municipality: e.target.value })}
              errorText={errors.municipality}
              maxLength={80}
            />
          </div>
        </Card>

        <Card variant="outlined">
          <CardHeader
            title="Horizonte de evaluación"
            subtitle="Número de años para evaluar costos y beneficios"
            icon="date_range"
          />
          <div className="flex items-center gap-4 flex-wrap">
            <TextField
              label="Año de inicio"
              type="number"
              value={String(meta.startYear)}
              onChange={(e) => {
                const yr = parseInt(e.target.value, 10);
                if (!isNaN(yr) && yr >= 2000 && yr <= 2100) updateMeta({ startYear: yr });
              }}
              className="w-32"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-on-surface whitespace-nowrap">Horizonte</label>
              <HorizonStepper
                value={meta.horizonYears}
                onChange={(v) => updateMeta({ horizonYears: v })}
              />
              <span className="text-sm text-on-surface-variant">años</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mt-3">
            El año 0 corresponde a la inversión inicial. Los años 1 a {meta.horizonYears} corresponden a operación.
          </p>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Descripción" subtitle="Resumen del proyecto" icon="description" />
          <TextArea
            label="Descripción del proyecto"
            value={meta.description}
            onChange={(e) => updateMeta({ description: e.target.value })}
            errorText={errors.description}
            helperText="Describe brevemente el problema que aborda el proyecto y la solución propuesta."
            maxLength={1000}
            showCounter
            rows={5}
          />
        </Card>

        {errorCount > 0 && (
          <div
            className="flex items-center gap-2 rounded-md bg-error-container px-4 py-3 text-sm text-on-error-container"
            role="status"
          >
            <Icon name="error" size={20} className="shrink-0" />
            <span>Faltan {errorCount} campos por completar. Revísalos arriba.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HorizonStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <Button
        variant="outlined"
        size="sm"
        icon="remove"
        aria-label="Disminuir horizonte"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      />
      <span className="min-w-[2.5rem] text-center text-lg font-semibold text-on-surface tabular-nums">
        {value}
      </span>
      <Button
        variant="outlined"
        size="sm"
        icon="add"
        aria-label="Aumentar horizonte"
        onClick={() => onChange(Math.min(20, value + 1))}
        disabled={value >= 20}
      />
    </div>
  );
}
