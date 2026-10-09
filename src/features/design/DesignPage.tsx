import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Fab } from '@/components/ui/Fab';
import { TextField } from '@/components/ui/TextField';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Chip } from '@/components/ui/Chip';
import { SegmentedButton } from '@/components/ui/SegmentedButton';
import { Switch } from '@/components/ui/Switch';
import { Tabs } from '@/components/ui/Tabs';
import { Dialog } from '@/components/ui/Dialog';
import { showSnackbar } from '@/components/ui/snackbarStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { NodeTreeIllustration } from '@/components/ui/NodeTreeIllustration';
import { STAGES, MODULES } from '@/config';

export function DesignPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState('tab1');
  const [chipSelected, setChipSelected] = useState<string[]>(['analisis']);
  const [segmented, setSegmented] = useState('opcion1');
  const [switchOn, setSwitchOn] = useState(true);
  const [textField, setTextField] = useState('');
  const [textArea, setTextArea] = useState('');
  const [selectVal, setSelectVal] = useState<string | undefined>(undefined);

  const toggleChip = (val: string) => {
    setChipSelected((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val],
    );
  };

  return (
    <div className="max-w-content mx-auto w-full px-4 py-6 md:py-8 space-y-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-on-surface mb-1">Muestra de diseño</h1>
        <p className="text-sm text-on-surface-variant">
          Todos los componentes en modo claro y oscuro. Cambia el tema desde la barra superior.
        </p>
      </div>

      {/* Logo & Identity */}
      <Card variant="outlined">
        <CardHeader title="Marca e identidad" icon="badge" />
        <div className="flex items-center gap-6 flex-wrap">
          <Logo size={48} />
          <Logo size={36} />
          <Logo size={28} />
          <Logo size={48} showText={false} />
        </div>
        <div className="mt-6">
          <p className="text-sm text-on-surface-variant mb-3">Ilustración de nodos</p>
          <NodeTreeIllustration size={180} />
        </div>
      </Card>

      {/* Stage colors */}
      <Card variant="outlined">
        <CardHeader title="Colores de etapas" icon="palette" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STAGES.map((stage) => (
            <div key={stage.id} className="rounded-lg p-4" style={{ backgroundColor: `${stage.colorVar}18` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.colorVar }} />
                <span className="text-sm font-medium text-on-surface">{stage.name}</span>
              </div>
              <div className="flex gap-1.5">
                {MODULES.filter((m) => m.stage === stage.id).map((m) => (
                  <div key={m.slug} className="rounded-sm px-2 py-1 text-xs" style={{ backgroundColor: `${stage.colorVar}24`, color: 'var(--on-surface)' }}>
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Buttons */}
      <Card variant="outlined">
        <CardHeader title="Botones" icon="touch_app" />
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="filled">Filled</Button>
            <Button variant="tonal">Tonal</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
            <Button variant="elevated">Elevated</Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="filled" size="sm" icon="add">Small</Button>
            <Button variant="filled" size="md" icon="add">Medium</Button>
            <Button variant="filled" size="lg" icon="add">Large</Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="filled" disabled>Disabled</Button>
            <Button variant="outlined" icon="download" iconRight="expand_more">Con íconos</Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <IconButton icon="edit" label="Editar" />
            <IconButton icon="delete" label="Eliminar" variant="filled" />
            <IconButton icon="share" label="Compartir" variant="tonal" />
            <IconButton icon="print" label="Imprimir" variant="outlined" />
            <Tooltip content="Botón con tooltip">
              <IconButton icon="info" label="Información" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <Fab icon="add" label="Nuevo" extended>Nuevo proyecto</Fab>
            <Fab icon="edit" label="Editar" />
          </div>
        </div>
      </Card>

      {/* Form fields */}
      <Card variant="outlined">
        <CardHeader title="Campos de formulario" icon="edit_note" />
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="Nombre del proyecto"
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            helperText="El nombre que aparecerá en el resumen"
            icon="folder"
          />
          <TextField
            label="Con error"
            value=""
            errorText="Este campo es obligatorio"
            icon="error"
          />
          <TextField
            label="Con contador"
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            maxLength={50}
            showCounter
          />
          <TextField
            label="Deshabilitado"
            value="No editable"
            disabled
          />
          <TextArea
            label="Descripción del proyecto"
            value={textArea}
            onChange={(e) => setTextArea(e.target.value)}
            helperText="Describe brevemente el proyecto"
            maxLength={200}
            showCounter
          />
          <Select
            label="Sector del proyecto"
            value={selectVal}
            onChange={setSelectVal}
            options={[
              { value: 'salud', label: 'Salud' },
              { value: 'educacion', label: 'Educación' },
              { value: 'infraestructura', label: 'Infraestructura' },
              { value: 'ambiental', label: 'Ambiental' },
            ]}
            placeholder="Selecciona un sector"
            helperText="Elige el sector principal"
          />
        </div>
      </Card>

      {/* Chips, Segmented, Switch */}
      <Card variant="outlined">
        <CardHeader title="Chips, botones segmentados y switch" icon="widgets" />
        <div className="space-y-4">
          <div>
            <p className="text-sm text-on-surface-variant mb-2">Chips de filtro</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { val: 'identificacion', label: 'Identificación' },
                { val: 'analisis', label: 'Análisis' },
                { val: 'evaluacion', label: 'Evaluación' },
                { val: 'programacion', label: 'Programación' },
              ].map((c) => (
                <Chip
                  key={c.val}
                  label={c.label}
                  variant="filter"
                  selected={chipSelected.includes(c.val)}
                  onClick={() => toggleChip(c.val)}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant mb-2">Chips de entrada (removibles)</p>
            <div className="flex gap-2 flex-wrap">
              <Chip label="Etiqueta 1" onRemove={() => {}} />
              <Chip label="Etiqueta 2" onRemove={() => {}} />
              <Chip label="Etiqueta 3" onRemove={() => {}} />
            </div>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant mb-2">Botones segmentados</p>
            <SegmentedButton
              value={segmented}
              onChange={setSegmented}
              options={[
                { value: 'opcion1', label: 'Opción 1' },
                { value: 'opcion2', label: 'Opción 2' },
                { value: 'opcion3', label: 'Opción 3' },
              ]}
            />
          </div>
          <div className="flex items-center gap-6">
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} label="Activar función" />
            <Switch checked={false} onCheckedChange={() => {}} label="Deshabilitado" />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card variant="outlined">
        <CardHeader title="Pestañas" icon="tab" />
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          tabs={[
            { value: 'tab1', label: 'General', icon: 'info' },
            { value: 'tab2', label: 'Detalles', icon: 'description' },
            { value: 'tab3', label: 'Historial', icon: 'history' },
          ]}
        >
          <p className="text-sm text-on-surface-variant">
            Contenido de la pestaña {tabValue}.
          </p>
        </Tabs>
      </Card>

      {/* Progress rings */}
      <Card variant="outlined">
        <CardHeader title="Anillos de progreso" icon="data_usage" />
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing progress={0} size={56} showLabel />
            <span className="text-xs text-on-surface-variant">0%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressRing progress={0.35} size={56} showLabel />
            <span className="text-xs text-on-surface-variant">35%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressRing progress={0.7} size={56} showLabel colorVar="var(--stage-evaluation)" />
            <span className="text-xs text-on-surface-variant">70%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressRing progress={1} size={56} showLabel pulseOnComplete colorVar="var(--stage-preparation)" />
            <span className="text-xs text-on-surface-variant">100%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressRing progress={0.5} size={32} colorVar="var(--stage-identification)" />
            <span className="text-xs text-on-surface-variant">Etapa</span>
          </div>
        </div>
      </Card>

      {/* Dialog & Snackbar */}
      <Card variant="outlined">
        <CardHeader title="Diálogos y notificaciones" icon="chat_bubble" />
        <div className="flex gap-3 flex-wrap">
          <Button variant="filled" onClick={() => setDialogOpen(true)} icon="dialog">
            Abrir diálogo
          </Button>
          <Button variant="tonal" onClick={() => showSnackbar('Cambios guardados', 'success')} icon="save">
            Snackbar éxito
          </Button>
          <Button variant="outlined" onClick={() => showSnackbar('Algo salió mal', 'error')} icon="error">
            Snackbar error
          </Button>
          <Button variant="text" onClick={() => showSnackbar('Información informativa', 'default', 'Deshacer', () => {})}>
            Snackbar con acción
          </Button>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="¿Eliminar proyecto?"
          description="Esta acción no se puede deshacer."
          actions={
            <>
              <Button variant="text" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button variant="filled" onClick={() => setDialogOpen(false)}>Eliminar</Button>
            </>
          }
        >
          <p className="text-sm text-on-surface-variant">
            Se eliminarán todos los datos del proyecto de forma permanente.
          </p>
        </Dialog>
      </Card>

      {/* Skeletons */}
      <Card variant="outlined">
        <CardHeader title="Esqueletos de carga" icon="hourglass_empty" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-20 w-20" rounded="lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </Card>

      {/* Empty state */}
      <Card variant="outlined">
        <CardHeader title="Estado vacío" icon="inbox" />
        <EmptyState
          icon={<NodeTreeIllustration size={140} />}
          title="No hay proyectos todavía"
          description="Crea tu primer proyecto de formulación para comenzar."
          actions={
            <>
              <Button variant="filled" icon="add">Nuevo proyecto</Button>
              <Button variant="outlined">Ver ejemplos</Button>
            </>
          }
        />
      </Card>

      {/* Icons */}
      <Card variant="outlined">
        <CardHeader title="Íconos (Material Symbols)" icon="star" />
        <div className="flex gap-3 flex-wrap text-on-surface">
          {['home', 'folder', 'settings', 'add', 'edit', 'delete', 'save', 'search', 'filter', 'download', 'print', 'share', 'check', 'close', 'error', 'info', 'help', 'palette', 'light_mode', 'dark_mode'].map((name) => (
            <div key={name} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-on-surface/5">
              <Icon name={name} size={24} />
              <span className="text-[10px] text-on-surface-variant">{name}</span>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-center text-xs text-on-surface-variant/60 pt-4 pb-8">
        Fin de la muestra de diseño — revisa cada componente en modo claro y oscuro.
      </p>
    </div>
  );
}
