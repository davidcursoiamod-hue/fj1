import { useEffect, useState } from 'react';
import type { ProjectSummary } from '@/data/schema';
import type { StageId } from '@/config';
import { overallProgress, stageProgressAll } from '@/lib/completion';
import { useProjectStore } from '@/store/projectStore';

export interface ProjectCardData {
  summary: ProjectSummary;
  overall: number;
  stages: { stageId: StageId; percent: number; colorVar: string }[];
}

/** Carga la lista de proyectos y calcula el avance de cada uno para las tarjetas. */
export function useProjectCards() {
  const projects = useProjectStore((s) => s.projects);
  const loadList = useProjectStore((s) => s.loadList);
  const getProject = useProjectStore((s) => s.getProject);
  const [listLoaded, setListLoaded] = useState(false);
  const [cards, setCards] = useState<ProjectCardData[]>([]);
  const [cardsReady, setCardsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadList()
      .catch(() => undefined)
      .finally(() => {
        if (alive) setListLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [loadList]);

  useEffect(() => {
    if (!listLoaded) return;
    let alive = true;
    (async () => {
      const out: ProjectCardData[] = [];
      for (const summary of projects) {
        const project = await getProject(summary.id);
        if (project) {
          out.push({ summary, overall: overallProgress(project), stages: stageProgressAll(project) });
        }
      }
      if (alive) {
        setCards(out);
        setCardsReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [projects, listLoaded, getProject]);

  return { cards, loading: !listLoaded || !cardsReady };
}
