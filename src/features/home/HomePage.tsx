import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AUTHOR } from '@/config';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Fab } from '@/components/ui/Fab';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { NodeTreeIllustration } from '@/components/ui/NodeTreeIllustration';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { TextField } from '@/components/ui/TextField';
import { showSnackbar } from '@/components/ui/snackbarStore';
import { shouldShowBackupReminder } from '@/lib/backupReminder';
import { downloadTextFile, safeFileName, todayStamp } from '@/lib/download';
import { describeImportResult } from '@/lib/importMessage';
import { filterAndSort, type SortOrder } from '@/lib/projectList';
import { useProjectStore } from '@/store/projectStore';
import { NewProjectDialog, type NewProjectValues } from './NewProjectDialog';
import { EXAMPLE_PREFIX, ProjectCard } from './ProjectCard';
import { useProjectCards, type ProjectCardData } from './useProjectCards';

const EXAMPLE_META = {
  name: `${EXAMPLE_PREFIX} comercialización de trucha en Popayán`,
  sector: 'Agricultura y desarrollo rural',
  municipality: 'Popayán',
  department: 'Cauca',
  horizonYears: 5,
};

export function HomePage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { cards, loading } = useProjectCards();

  const projects = useProjectStore((s) => s.projects);
  const isMemoryOnly = useProjectStore((s) => s.isMemoryOnly);
  const createProject = useProjectStore((s) => s.createProject);
  const duplicateProject = useProjectStore((s) => s.duplicateProject);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const restoreProject = useProjectStore((s) => s.restoreProject);
  const getProject = useProjectStore((s) => s.getProject);
  const exportProject = useProjectStore((s) => s.exportProject);
  const exportAll = useProjectStore((s) => s.exportAll);
  const importFile = useProjectStore((s) => s.importFile);

  const [newOpen, setNewOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ProjectCardData | null>(null);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<SortOrder>('recientes');
  const [backupDismissed, setBackupDismissed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showBackup = !backupDismissed && shouldShowBackupReminder(projects);

  const visible = useMemo(() => {
    const byId = new Map(cards.map((c) => [c.summary.id, c]));
    return filterAndSort(
      cards.map((c) => ({ summary: c.summary, overall: c.overall })),
      query,
      order,
    ).map((i) => byId.get(i.summary.id) as ProjectCardData);
  }, [cards, query, order]);

  // ---- Acciones ----

  async function handleCreate(values: NewProjectValues) {
    const id = await createProject(values);
    setNewOpen(false);
    navigate(`/p/${id}/datos`);
  }

  async function handleLoadExample() {
    const id = await createProject(EXAMPLE_META);
    showSnackbar('Proyecto de ejemplo creado.', 'success');
    navigate(`/p/${id}/datos`);
  }

  async function handleDuplicate(id: string) {
    const newId = await duplicateProject(id);
    showSnackbar(newId ? 'Proyecto duplicado.' : 'No se pudo duplicar el proyecto.', newId ? 'success' : 'error');
  }

  async function handleExport(card: ProjectCardData) {
    const json = await exportProject(card.summary.id);
    if (!json) {
      showSnackbar('No se pudo exportar el proyecto.', 'error');
      return;
    }
    downloadTextFile(`${safeFileName(card.summary.name)}-${todayStamp()}.json`, json);
    showSnackbar('Copia descargada.', 'success');
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.summary.id;
    setToDelete(null);
    const project = await getProject(id);
    await deleteProject(id);
    showSnackbar('Proyecto eliminado.', 'default', project ? 'Deshacer' : undefined, project ? () => void restoreProject(project) : undefined);
  }

  async function handleImportFile(file: File | undefined) {
    if (!file) return;
    const result = describeImportResult(await importFile(await file.text()));
    showSnackbar(result.message, result.variant);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleBackup() {
    const json = await exportAll();
    downloadTextFile(`formula-proyectos-${todayStamp()}.json`, json);
    setBackupDismissed(true);
    showSnackbar('Copia de seguridad descargada.', 'success');
  }

  return (
    <div className="flex min-h-full flex-col">
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        aria-label="Importar proyecto desde un archivo .json"
        onChange={(e) => void handleImportFile(e.target.files?.[0])}
      />

      <div className="mx-auto w-full max-w-content flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-3">
          {isMemoryOnly && (
            <Banner tone="error" icon="warning" title="Tus proyectos no se están guardando de forma permanente.">
              El almacenamiento del navegador no está disponible (por ejemplo, en una ventana privada). Descarga una copia antes de cerrar la pestaña.
            </Banner>
          )}
          {showBackup && (
            <Banner
              tone="warning"
              icon="cloud_download"
              title="Tus proyectos viven en este navegador."
              onDismiss={() => setBackupDismissed(true)}
              action={<Button variant="tonal" size="sm" icon="download" onClick={() => void handleBackup()}>Descargar copia</Button>}
            >
              Descarga una copia para no perderlos si borras los datos del navegador.
            </Banner>
          )}
        </div>

        {loading ? (
          <LoadingGrid />
        ) : cards.length === 0 ? (
          <EmptyHome
            reduced={Boolean(reduced)}
            onNew={() => setNewOpen(true)}
            onExample={() => void handleLoadExample()}
            onImport={() => fileRef.current?.click()}
          />
        ) : (
          <section aria-labelledby="mis-proyectos" className="mt-2">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 id="mis-proyectos" className="text-2xl font-semibold text-on-surface">Mis proyectos</h1>
                <p className="text-sm text-on-surface-variant">
                  {cards.length} {cards.length === 1 ? 'proyecto guardado' : 'proyectos guardados'} en este navegador
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="tonal" size="sm" icon="science" onClick={() => void handleLoadExample()}>
                  Cargar ejemplo
                </Button>
                <Button variant="outlined" size="sm" icon="upload_file" onClick={() => fileRef.current?.click()}>
                  Importar (.json)
                </Button>
              </div>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
              <TextField
                label="Buscar proyectos"
                icon="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
              />
              <Select
                label="Ordenar por"
                value={order}
                onChange={(v) => setOrder(v as SortOrder)}
                options={[
                  { value: 'recientes', label: 'Más recientes' },
                  { value: 'nombre', label: 'Nombre' },
                  { value: 'avance', label: 'Avance' },
                ]}
              />
            </div>

            {visible.length === 0 ? (
              <p className="rounded-lg bg-surface-container p-6 text-center text-sm text-on-surface-variant">
                Ningún proyecto coincide con «{query}».
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence initial>
                  {visible.map((card, i) => (
                    <ProjectCard
                      key={card.summary.id}
                      data={card}
                      index={i}
                      onOpen={() => navigate(`/p/${card.summary.id}/datos`)}
                      onDuplicate={() => void handleDuplicate(card.summary.id)}
                      onExport={() => void handleExport(card)}
                      onDelete={() => setToDelete(card)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </section>
        )}
      </div>

      {!loading && cards.length > 0 && (
        <div className="fixed bottom-20 right-4 z-30 md:bottom-6 md:right-6">
          <Fab icon="add" label="Nuevo proyecto" extended onClick={() => setNewOpen(true)}>
            Nuevo proyecto
          </Fab>
        </div>
      )}

      <NewProjectDialog open={newOpen} onOpenChange={setNewOpen} onCreate={handleCreate} />

      <Dialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="¿Eliminar este proyecto?"
        description={toDelete ? `«${toDelete.summary.name}» se eliminará de este navegador. Podrás deshacerlo unos segundos después.` : undefined}
        actions={
          <>
            <Button variant="text" onClick={() => setToDelete(null)}>Cancelar</Button>
            <Button variant="filled" icon="delete" className="!bg-error !text-on-error" onClick={() => void confirmDelete()}>
              Eliminar
            </Button>
          </>
        }
      >
        <span className="sr-only">Confirma la eliminación del proyecto.</span>
      </Dialog>

      <Footer />
    </div>
  );
}

// ---- Partes ----

function EmptyHome({
  reduced,
  onNew,
  onExample,
  onImport,
}: {
  reduced: boolean;
  onNew: () => void;
  onExample: () => void;
  onImport: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-2 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-md text-center"
      >
        <NodeTreeIllustration size={220} className="mx-auto mb-8" />
        <h1
          className="mb-3 text-on-surface"
          style={{
            fontVariationSettings: "'opsz' 36, 'wdth' 110, 'wght' 700",
            fontSize: 'clamp(28px, 5vw, 36px)',
            lineHeight: 1.15,
          }}
        >
          Formula tus proyectos de inversión
        </h1>
        <p className="mb-8 text-base leading-relaxed text-on-surface-variant">
          Construye paso a paso proyectos basados en la metodología MGA. Identifica el problema, define objetivos, evalúa viabilidad y programa la ejecución.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Fab icon="add" label="Nuevo proyecto" extended onClick={onNew}>
            Nuevo proyecto
          </Fab>
          <Button variant="outlined" icon="science" onClick={onExample}>
            Cargar proyecto de ejemplo
          </Button>
        </div>
        <div className="mt-4">
          <Button variant="text" icon="upload_file" onClick={onImport}>
            Importar proyecto (.json)
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="mt-2" aria-busy="true" aria-label="Cargando proyectos">
      <Skeleton className="mb-5 h-8 w-56" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-44 w-full" rounded="lg" />
        ))}
      </div>
    </div>
  );
}

function Banner({
  tone,
  icon,
  title,
  children,
  action,
  onDismiss,
}: {
  tone: 'warning' | 'error';
  icon: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
}) {
  const toneClass =
    tone === 'error'
      ? 'bg-error-container text-on-error-container'
      : 'bg-tertiary-container text-on-tertiary-container';
  return (
    <div role="status" className={`flex items-start gap-3 rounded-lg p-4 ${toneClass}`}>
      <Icon name={icon} size={22} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-sm opacity-90">{children}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && <IconButton icon="close" label="Descartar aviso" size="sm" onClick={onDismiss} />}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 px-6 py-5 text-center">
      <p className="text-xs leading-relaxed text-on-surface-variant">Creado por {AUTHOR}</p>
      <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-on-surface-variant/70">
        Herramienta educativa basada en la metodología MGA del DNP. No es el aplicativo oficial.
      </p>
    </footer>
  );
}
