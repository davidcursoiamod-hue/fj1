import { useMemo, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { Dialog } from '@/components/ui/Dialog';
import type { Project, Stakeholder, StakeholderKind } from '@/data/schema';
import { useProjectStore } from '@/store/projectStore';

const KIND_META: Record<StakeholderKind, { label: string; icon: string; colorVar: string; bgVar: string }> = {
  beneficiario: { label: 'Beneficiario', icon: 'favorite', colorVar: 'var(--stage-preparation)', bgVar: 'var(--stage-preparation-container)' },
  cooperante: { label: 'Cooperante', icon: 'handshake', colorVar: 'var(--stage-identification)', bgVar: 'var(--stage-identification-container)' },
  perjudicado: { label: 'Perjudicado', icon: 'sentiment_dissatisfied', colorVar: 'var(--problem)', bgVar: 'var(--problem-container)' },
  oponente: { label: 'Oponente', icon: 'block', colorVar: 'var(--error)', bgVar: 'var(--error-container)' },
  regulador: { label: 'Regulador', icon: 'gavel', colorVar: 'var(--stage-programming)', bgVar: 'var(--stage-programming-container)' },
};

const STANCE_META: Record<string, { label: string; colorVar: string }> = {
  a_favor: { label: 'A favor', colorVar: 'var(--stage-preparation)' },
  neutral: { label: 'Neutral', colorVar: 'var(--outline)' },
  en_contra: { label: 'En contra', colorVar: 'var(--error)' },
};

const KINDS: StakeholderKind[] = ['beneficiario', 'cooperante', 'perjudicado', 'oponente', 'regulador'];
const STANCES = ['a_favor', 'neutral', 'en_contra'] as const;

export function ParticipantesModule({ project }: { project: Project }) {
  const updateProject = useProjectStore((s) => s.updateProject);
  const stakeholders = project.stakeholders;

  function updateStakeholders(next: Stakeholder[]) {
    updateProject({ ...project, stakeholders: next });
  }

  function addStakeholder() {
    const next: Stakeholder = {
      id: crypto.randomUUID(),
      name: '',
      kind: 'beneficiario',
      role: '',
      expectation: '',
      stance: 'neutral',
    };
    updateStakeholders([...stakeholders, next]);
  }

  function updateRow(id: string, patch: Partial<Stakeholder>) {
    updateStakeholders(stakeholders.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function deleteRow(id: string) {
    updateStakeholders(stakeholders.filter((s) => s.id !== id));
  }

  const counts = useMemo(() => {
    const c: Record<StakeholderKind, number> = { beneficiario: 0, cooperante: 0, perjudicado: 0, oponente: 0, regulador: 0 };
    for (const s of stakeholders) c[s.kind]++;
    return c;
  }, [stakeholders]);

  const matrix = useMemo(() => {
    const m: Record<string, Record<StakeholderKind, number>> = {};
    for (const st of STANCES) {
      m[st] = { beneficiario: 0, cooperante: 0, perjudicado: 0, oponente: 0, regulador: 0 };
    }
    for (const s of stakeholders) {
      m[s.stance][s.kind]++;
    }
    return m;
  }, [stakeholders]);

  return (
    <div className="mx-auto w-full max-w-content px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-4">
        <Card variant="outlined">
          <CardHeader
            title="Participantes y stakeholders"
            subtitle="Personas, comunidades y entidades que participan o se ven afectadas"
            icon="groups"
            action={
              <Button variant="tonal" size="sm" icon="person_add" onClick={addStakeholder}>
                Agregar
              </Button>
            }
          />

          {stakeholders.length === 0 ? (
            <div className="py-8 text-center text-sm text-on-surface-variant">
              No hay participantes. Pulsa «Agregar» para registrar el primero.
            </div>
          ) : (
            <div className="space-y-3">
              {stakeholders.map((s) => (
                <ParticipantRow
                  key={s.id}
                  stakeholder={s}
                  onChange={(patch) => updateRow(s.id, patch)}
                  onDelete={() => deleteRow(s.id)}
                />
              ))}
            </div>
          )}
        </Card>

        {stakeholders.length > 0 && (
          <Card variant="outlined">
            <CardHeader title="Resumen por tipo" icon="pie_chart" />
            <div className="flex flex-wrap gap-3">
              {KINDS.map((k) => {
                const m = KIND_META[k];
                return (
                  <div
                    key={k}
                    className="flex items-center gap-2.5 rounded-md px-4 py-3"
                    style={{ backgroundColor: 'var(--surface-container)' }}
                  >
                    <span
                      className="flex items-center justify-center rounded-pill w-8 h-8 shrink-0"
                      style={{ backgroundColor: m.bgVar }}
                    >
                      <Icon name={m.icon} size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{m.label}</p>
                      <p className="text-xs text-on-surface-variant tabular-nums">{counts[k]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {stakeholders.length > 0 && (
          <Card variant="outlined">
            <CardHeader
              title="Matriz posición × tipo"
              subtitle="Distribución de posturas por tipo de participante"
              icon="grid_view"
            />
            <StanceTypeMatrix matrix={matrix} />
          </Card>
        )}
      </div>
    </div>
  );
}

function ParticipantRow({
  stakeholder,
  onChange,
  onDelete,
}: {
  stakeholder: Stakeholder;
  onChange: (patch: Partial<Stakeholder>) => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const km = KIND_META[stakeholder.kind];

  return (
    <div className="rounded-md border border-outline-variant p-4 space-y-3 bg-surface">
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: km.bgVar, color: 'var(--on-surface)' }}
        >
          <Icon name={km.icon} size={16} />
          {km.label}
        </span>
        <Button variant="text" size="sm" icon="delete" className="!text-error" onClick={() => setConfirmDelete(true)}>
          Eliminar
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <TextField
          label="Nombre"
          value={stakeholder.name}
          onChange={(e) => onChange({ name: e.target.value })}
          maxLength={120}
        />
        <Select
          label="Tipo"
          value={stakeholder.kind}
          onChange={(v) => onChange({ kind: v as StakeholderKind })}
          options={KINDS.map((k) => ({ value: k, label: KIND_META[k].label }))}
        />
        <TextField
          label="Rol"
          value={stakeholder.role}
          onChange={(e) => onChange({ role: e.target.value })}
          maxLength={150}
          helperText="Qué hace en relación con el proyecto"
        />
        <Select
          label="Posición"
          value={stakeholder.stance}
          onChange={(v) => onChange({ stance: v as Stakeholder['stance'] })}
          options={STANCES.map((st) => ({ value: st, label: STANCE_META[st].label }))}
        />
      </div>

      <TextArea
        label="Expectativa"
        value={stakeholder.expectation}
        onChange={(e) => onChange({ expectation: e.target.value })}
        maxLength={300}
        showCounter
        helperText="Qué espera o qué aporta al proyecto"
        rows={2}
      />

      <Dialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="¿Eliminar participante?"
        description={stakeholder.name ? `«${stakeholder.name}» se eliminará del proyecto.` : 'Este participante se eliminará del proyecto.'}
        actions={
          <>
            <Button variant="text" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
            <Button
              variant="filled"
              className="!bg-error !text-on-error"
              icon="delete"
              onClick={() => { onDelete(); setConfirmDelete(false); }}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <span className="sr-only">Confirmar eliminación</span>
      </Dialog>
    </div>
  );
}

function StanceTypeMatrix({
  matrix,
}: {
  matrix: Record<string, Record<StakeholderKind, number>>;
}) {
  const kindLabels: { kind: StakeholderKind; label: string; colorVar: string }[] = KINDS.map((k) => ({
    kind: k,
    label: KIND_META[k].label,
    colorVar: KIND_META[k].colorVar,
  }));

  const stanceLabels = STANCES.map((st) => ({ stance: st, label: STANCE_META[st].label }));

  const maxVal = Math.max(
    1,
    ...stanceLabels.flatMap((s) => kindLabels.map((k) => matrix[s.stance][k.kind])),
  );

  const cellW = 72;
  const labelW = 90;
  const headerH = 48;
  const rowH = 44;
  const totalW = labelW + kindLabels.length * cellW;
  const totalH = headerH + stanceLabels.length * rowH;

  return (
    <div className="overflow-x-auto">
      <svg
        width={totalW}
        height={totalH}
        className="block"
        role="img"
        aria-label="Matriz de posición por tipo de participante"
      >
        {kindLabels.map((k, i) => {
          const x = labelW + i * cellW;
          return (
            <g key={k.kind}>
              <rect x={x} y={0} width={cellW} height={headerH} fill="var(--surface-container)" />
              <text
                x={x + cellW / 2}
                y={headerH / 2 - 4}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="var(--on-surface)"
              >
                {k.label.length > 10 ? k.label.slice(0, 9) + '…' : k.label}
              </text>
              <circle cx={x + cellW / 2} cy={headerH - 8} r={3} fill={k.colorVar} />
            </g>
          );
        })}

        {stanceLabels.map((st, ri) => {
          const y = headerH + ri * rowH;
          return (
            <g key={st.stance}>
              <rect
                x={0}
                y={y}
                width={totalW}
                height={rowH}
                fill={ri % 2 === 0 ? 'var(--surface-container-low)' : 'transparent'}
              />
              <text
                x={8}
                y={y + rowH / 2 + 4}
                fontSize={11}
                fontWeight={600}
                fill="var(--on-surface)"
              >
                {st.label}
              </text>
              <circle cx={labelW - 10} cy={y + rowH / 2} r={4} fill={STANCE_META[st.stance].colorVar} />
              {kindLabels.map((k, ci) => {
                const val = matrix[st.stance][k.kind];
                const x = labelW + ci * cellW;
                const barH = (val / maxVal) * (rowH - 12);
                return (
                  <g key={k.kind}>
                    <rect
                      x={x + 2}
                      y={y + 2}
                      width={cellW - 4}
                      height={rowH - 4}
                      fill="none"
                      stroke="var(--outline-variant)"
                      strokeWidth={0.5}
                      rx={4}
                    />
                    {val > 0 && (
                      <rect
                        x={x + 8}
                        y={y + rowH - 6 - barH}
                        width={cellW - 16}
                        height={barH}
                        fill={k.colorVar}
                        opacity={0.7}
                        rx={3}
                      />
                    )}
                    <text
                      x={x + cellW / 2}
                      y={y + rowH / 2 + 4}
                      textAnchor="middle"
                      fontSize={13}
                      fontWeight={700}
                      fill="var(--on-surface)"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
