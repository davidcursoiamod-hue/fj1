import type { ProjectSummary } from '@/data/schema';

export type SortOrder = 'recientes' | 'nombre' | 'avance';

export interface ProjectListItem {
  summary: ProjectSummary;
  /** Avance global 0–100. */
  overall: number;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Filtra por nombre, sector o municipio (sin distinguir mayúsculas ni tildes) y ordena. */
export function filterAndSort(items: ProjectListItem[], query: string, order: SortOrder): ProjectListItem[] {
  const q = normalize(query.trim());
  const filtered = q
    ? items.filter(({ summary: s }) =>
        normalize(`${s.name} ${s.sector} ${s.municipality}`).includes(q),
      )
    : items.slice();

  return filtered.sort((a, b) => {
    switch (order) {
      case 'nombre':
        return a.summary.name.localeCompare(b.summary.name, 'es', { sensitivity: 'base' });
      case 'avance':
        return b.overall - a.overall || b.summary.updatedAt.localeCompare(a.summary.updatedAt);
      case 'recientes':
      default:
        return b.summary.updatedAt.localeCompare(a.summary.updatedAt);
    }
  });
}
