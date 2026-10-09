import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { STAGES, MODULES, type StageId } from '@/config';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { moduleProgress, stageProgress } from '@/lib/completion';
import type { Project } from '@/data/schema';

interface StepperRailProps {
  projectId: string;
  project: Project | null;
}

export function StepperRail({ projectId, project }: StepperRailProps) {
  const location = useLocation();
  const currentSlug = location.pathname.split('/').pop() ?? '';

  return (
    <nav
      className="hidden lg:flex flex-col w-72 shrink-0 border-r border-outline-variant/50 bg-surface-low overflow-y-auto"
      aria-label="Etapas y módulos del proyecto"
    >
      <div className="p-4">
        {STAGES.map((stage) => {
          const stageModules = MODULES.filter((m) => m.stage === stage.id);
          const stagePct = project ? stageProgress(project, stage.id as StageId) : 0;
          return (
            <div key={stage.id} className="mb-4">
              <div className="flex items-center gap-2.5 mb-2 px-2">
                <ProgressRing
                  progress={stagePct / 100}
                  size={18}
                  strokeWidth={2.5}
                  colorVar={stage.colorVar}
                  trackColorVar="var(--outline-variant)"
                />
                <span className="text-sm font-semibold text-on-surface">{stage.name}</span>
                <span className="text-xs text-on-surface-variant ml-auto tabular-nums">{stagePct}%</span>
              </div>
              <div className="space-y-0.5">
                {stageModules.map((mod) => {
                  const to = `/p/${projectId}/${mod.slug}`;
                  const active = currentSlug === mod.slug;
                  const prog = project
                    ? moduleProgress(project, mod.slug)
                    : { percent: 0, missing: ['Módulo aún no disponible'] };
                  const missingTitle = prog.percent < 100 ? prog.missing.join(', ') : undefined;
                  return (
                    <Link
                      key={mod.slug}
                      to={to}
                      className={cn(
                        'state-layer flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-150',
                        active
                          ? 'bg-surface-container text-on-surface font-medium'
                          : 'text-on-surface-variant hover:bg-on-surface/5',
                      )}
                      aria-current={active ? 'page' : undefined}
                      title={missingTitle}
                    >
                      <ProgressRing
                        progress={prog.percent / 100}
                        size={20}
                        strokeWidth={2.5}
                        colorVar={stage.colorVar}
                        trackColorVar="var(--outline-variant)"
                      />
                      <span className="flex-1 truncate">{mod.name}</span>
                      {active && (
                        <motion.div
                          layoutId="stepper-active"
                          className="w-1 h-5 rounded-pill"
                          style={{ backgroundColor: stage.colorVar }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Summary module */}
        {(() => {
          const summaryMod = MODULES.find((m) => m.stage === 'summary');
          if (!summaryMod) return null;
          const to = `/p/${projectId}/${summaryMod.slug}`;
          const active = currentSlug === summaryMod.slug;
          return (
            <div className="mb-4">
              <div className="flex items-center gap-2.5 mb-2 px-2">
                <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                <span className="text-sm font-semibold text-on-surface">{summaryMod.name}</span>
              </div>
              <Link
                to={to}
                className={cn(
                  'state-layer flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-150',
                  active
                    ? 'bg-surface-container text-on-surface font-medium'
                    : 'text-on-surface-variant hover:bg-on-surface/5',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <ProgressRing progress={0} size={20} strokeWidth={2.5} />
                <span className="flex-1 truncate">{summaryMod.name}</span>
              </Link>
            </div>
          );
        })()}
      </div>
    </nav>
  );
}
