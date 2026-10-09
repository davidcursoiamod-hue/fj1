import { EmptyState } from '@/components/ui/EmptyState';
import { getModule, getStage } from '@/config';
import { NodeTreeIllustration } from '@/components/ui/NodeTreeIllustration';

interface ModulePlaceholderProps {
  slug: string;
}

export function ModulePlaceholder({ slug }: ModulePlaceholderProps) {
  const mod = getModule(slug);

  if (!mod) {
    return (
      <EmptyState
        title="Módulo no encontrado"
        description="El módulo que buscas no existe o no está disponible."
      />
    );
  }

  const stage = mod.stage !== 'summary' ? getStage(mod.stage) : null;
  const stageColor = stage?.colorVar ?? 'var(--primary)';

  return (
    <div className="max-w-content mx-auto w-full px-4 py-6 md:py-8">
      <EmptyState
        icon={
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: stage ? `${stage.colorVar}18` : 'var(--primary-container)' }}
          >
            <NodeTreeIllustration size={120} />
          </div>
        }
        title={`Módulo: ${mod.name}`}
        description="Este módulo se construye en el siguiente paso. Aquí podrás editar la información correspondiente a esta etapa de la formulación."
      />
      {stage && (
        <div className="mt-6 max-w-sm mx-auto">
          <div
            className="flex items-center gap-2 rounded-md px-4 py-3"
            style={{ backgroundColor: `${stageColor}14` }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: stageColor }}
            />
            <span className="text-sm text-on-surface-variant">
              Etapa: <span className="font-medium text-on-surface">{stage.name}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
