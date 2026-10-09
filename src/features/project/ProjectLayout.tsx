import { type ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { MODULES } from '@/config';
import { StepperRail } from '@/components/layout/StepperRail';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { getHelpText } from '@/data/help';
import { useProjectStore, type SaveStatus } from '@/store/projectStore';

// ---- Save status indicator ----

function SaveIndicator({ status }: { status: SaveStatus }) {
  const reduced = useReducedMotion();
  if (status === 'idle') return null;

  const map: Record<Exclude<SaveStatus, 'idle'>, { icon: string; text: string; cls: string; spin?: boolean }> = {
    guardando: { icon: 'sync', text: 'Guardando…', cls: 'text-on-surface-variant', spin: !reduced },
    guardado: { icon: 'check_circle', text: 'Guardado', cls: 'text-primary' },
    error: { icon: 'error', text: 'Error al guardar', cls: 'text-error' },
  };
  const cfg = map[status as Exclude<SaveStatus, 'idle'>];
  if (!cfg) return null;

  return (
    <div className={cn('flex items-center gap-1.5 text-xs font-medium', cfg.cls)}>
      <span
        className="material-symbols-rounded"
        style={{ fontSize: 16, animation: cfg.spin ? 'spin 1s linear infinite' : undefined }}
      >
        {cfg.icon}
      </span>
      {cfg.text}
    </div>
  );
}

// ---- Help content (collapsible on wide screens, hidden on mobile) ----

function HelpContent({ title, body }: { title: string; body: string }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  return (
    <div className="hidden md:block max-w-xs">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="state-layer flex items-center gap-1.5 text-sm font-medium text-on-surface-variant rounded-sm px-2 py-1"
        aria-expanded={expanded}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 18 }}>help</span>
        ¿Qué es esto?
        <span
          className="material-symbols-rounded"
          style={{ fontSize: 18, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }}
        >
          expand_more
        </span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0.12 } : { duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-md bg-surface-container p-3">
              <p className="text-xs font-semibold text-on-surface mb-1">{title}</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">{body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Project loading hook ----

type LoadState = 'loading' | 'ready' | 'not-found';

function useLoadProject(projectId: string): LoadState {
  const current = useProjectStore((s) => s.current);
  const openProject = useProjectStore((s) => s.openProject);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    if (current && current.id === projectId) {
      setState('ready');
      return;
    }
    setState('loading');
    openProject(projectId).then(() => {
      const proj = useProjectStore.getState().current;
      setState(proj && proj.id === projectId ? 'ready' : 'not-found');
    });
  }, [projectId, current, openProject]);

  return state;
}

// ---- Project Layout ----

interface ProjectLayoutProps {
  projectId: string;
  children: ReactNode;
}

export function ProjectLayout({ projectId, children }: ProjectLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.split('/').pop() ?? '';
  const mod = MODULES.find((m) => m.slug === slug);
  const current = useProjectStore((s) => s.current);
  const saveStatus = useProjectStore((s) => s.saveStatus);
  const loadState = useLoadProject(projectId);

  if (loadState === 'not-found') {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <EmptyState
          icon={<span className="material-symbols-rounded text-on-surface-variant" style={{ fontSize: 48 }}>search_off</span>}
          title="Proyecto no encontrado"
          description="El proyecto que buscas no existe o fue eliminado."
          actions={<Button variant="filled" icon="home" onClick={() => navigate('/')}>Volver al inicio</Button>}
        />
      </div>
    );
  }

  const project = loadState === 'ready' ? current : null;
  const currentIndex = MODULES.findIndex((m) => m.slug === slug);
  const prevMod = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextMod = currentIndex >= 0 && currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;
  const helpEntry = mod ? getHelpText(mod.slug) : null;

  return (
    <div className="flex flex-1 min-h-0">
      <StepperRail projectId={projectId} project={project} />
      <div className="flex-1 min-w-0 flex flex-col">
        {mod && (
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-outline-variant/30 bg-surface-low gap-4">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-on-surface truncate">
                {project ? project.meta.name : 'Proyecto'}
              </h1>
              <p className="text-xs text-on-surface-variant truncate">{mod.name}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <SaveIndicator status={saveStatus} />
              {helpEntry && <HelpContent title={helpEntry.title} body={helpEntry.body} />}
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-outline-variant/30 bg-surface-low">
          <div>
            {prevMod && (
              <Link
                to={`/p/${projectId}/${prevMod.slug}`}
                className="state-layer inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-rounded" style={{ fontSize: 20 }}>chevron_left</span>
                <span className="hidden sm:inline">{prevMod.name}</span>
                <span className="sm:hidden">Anterior</span>
              </Link>
            )}
          </div>
          <div>
            {nextMod && (
              <Link
                to={`/p/${projectId}/${nextMod.slug}`}
                className="state-layer inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-medium text-primary transition-colors"
              >
                <span className="hidden sm:inline">{nextMod.name}</span>
                <span className="sm:hidden">Siguiente</span>
                <span className="material-symbols-rounded" style={{ fontSize: 20 }}>chevron_right</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
