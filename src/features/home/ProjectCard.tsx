import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { getStage } from '@/config';
import { formatRelativeDate } from '@/lib/format';
import { ProjectMenu } from './ProjectMenu';
import type { ProjectCardData } from './useProjectCards';

export const EXAMPLE_PREFIX = 'Ejemplo:';

interface ProjectCardProps {
  data: ProjectCardData;
  index: number;
  onOpen: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export function ProjectCard({ data, index, onOpen, onDuplicate, onExport, onDelete }: ProjectCardProps) {
  const reduced = useReducedMotion();
  const { summary, overall, stages } = data;
  const isExample = summary.name.startsWith(EXAMPLE_PREFIX);

  return (
    <motion.li
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0.12 }
          : { type: 'spring', stiffness: 380, damping: 32, delay: Math.min(index, 11) * 0.04 }
      }
    >
      <Card variant="outlined" interactive className="relative flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-base font-semibold leading-snug text-on-surface">
            <Link
              to={`/p/${summary.id}/datos`}
              className="line-clamp-2 rounded-sm outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-primary"
            >
              {summary.name}
            </Link>
          </h3>
          <div className="relative z-10 -mr-2 -mt-1 shrink-0">
            <ProjectMenu
              projectName={summary.name}
              onOpen={onOpen}
              onDuplicate={onDuplicate}
              onExport={onExport}
              onDelete={onDelete}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {isExample && <Chip label="Ejemplo ilustrativo" icon="science" />}
          {summary.sector && <Chip label={summary.sector} />}
          {summary.municipality && <Chip label={summary.municipality} icon="location_on" />}
        </div>

        <div className="mt-auto flex items-center gap-4">
          <ProgressRing progress={overall / 100} size={56} strokeWidth={5} showLabel colorVar="var(--primary)" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-on-surface-variant">Avance global</p>
            <div className="mt-1.5 flex gap-1.5" role="img" aria-label={`Avance por etapa: ${stages.map((s) => `${getStage(s.stageId)?.name} ${s.percent}%`).join(', ')}`}>
              {stages.map((s) => (
                <div
                  key={s.stageId}
                  title={`${getStage(s.stageId)?.name}: ${s.percent}%`}
                  className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface-highest"
                >
                  <motion.div
                    className="h-full rounded-pill"
                    style={{ background: s.colorVar }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percent}%` }}
                    transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 120, damping: 24, delay: 0.15 + index * 0.03 }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-on-surface-variant">
              Actualizado {formatRelativeDate(summary.updatedAt)}
            </p>
          </div>
        </div>
      </Card>
    </motion.li>
  );
}
