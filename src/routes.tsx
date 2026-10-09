import { lazy, Suspense } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProjectLayout } from '@/features/project/ProjectLayout';
import { ModulePlaceholder } from '@/features/project/ModulePlaceholder';
import { useProjectStore } from '@/store/projectStore';
import { DatosModule } from '@/features/project/modules/DatosModule';
import { ParticipantesModule } from '@/features/project/modules/ParticipantesModule';
import { PoblacionModule } from '@/features/project/modules/PoblacionModule';
import type { Project } from '@/data/schema';

const HomePage = lazy(() => import('@/features/home/HomePage').then((m) => ({ default: m.HomePage })));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const DesignPage = lazy(() => import('@/features/design/DesignPage').then((m) => ({ default: m.DesignPage })));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 rounded-pill border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

const REAL_MODULES: Record<string, React.ComponentType<{ project: Project }>> = {
  datos: DatosModule,
  participantes: ParticipantesModule,
  poblacion: PoblacionModule,
};

function ProjectRoute() {
  const { projectId = '', slug = '' } = useParams();
  const current = useProjectStore((s) => s.current);

  const RealModule = REAL_MODULES[slug];

  return (
    <ProjectLayout projectId={projectId}>
      {RealModule && current ? (
        <RealModule project={current} />
      ) : (
        <ModulePlaceholder slug={slug} />
      )}
    </ProjectLayout>
  );
}

export function AppRoutes() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
          <Route path="/diseno" element={<DesignPage />} />
          <Route path="/p/:projectId/:slug" element={<ProjectRoute />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
