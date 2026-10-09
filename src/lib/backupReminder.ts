import type { ProjectSummary } from '@/data/schema';

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Devuelve true si hay proyectos y han pasado más de 14 días
 * sin una exportación reciente (lastExportedAt).
 */
export function shouldShowBackupReminder(projects: ProjectSummary[]): boolean {
  if (projects.length === 0) return false;

  const now = Date.now();
  for (const p of projects) {
    if (!p.lastExportedAt) {
      // Si nunca se exportó y fue actualizado hace más de 14 días
      const updated = new Date(p.updatedAt).getTime();
      if (now - updated > FOURTEEN_DAYS_MS) return true;
    } else {
      const exported = new Date(p.lastExportedAt).getTime();
      if (now - exported > FOURTEEN_DAYS_MS) return true;
    }
  }
  return false;
}
