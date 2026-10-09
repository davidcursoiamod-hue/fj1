import { create } from 'zustand';
import type { Project, ProjectSummary } from '@/data/schema';
import { createEmptyProject, type ProjectMeta } from '@/data/schema';
import type { ProjectRepository } from '@/data/repository';
import { IndexedDbRepository } from '@/data/indexedDbRepository';
import { CURRENT_SCHEMA_VERSION } from '@/data/migrations';
import { getDefaultDiscountRatePct } from '@/lib/settings';

export type SaveStatus = 'idle' | 'guardando' | 'guardado' | 'error';

interface ProjectStore {
  // State
  projects: ProjectSummary[];
  current: Project | null;
  saveStatus: SaveStatus;
  isMemoryOnly: boolean;

  // Actions
  loadList: () => Promise<void>;
  openProject: (id: string) => Promise<void>;
  createProject: (meta?: Partial<ProjectMeta>) => Promise<string>;
  updateProject: (project: Project) => void;
  duplicateProject: (id: string) => Promise<string | null>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  /** Vuelve a guardar un proyecto (por ejemplo, al deshacer una eliminación). */
  restoreProject: (project: Project) => Promise<void>;
  /** JSON de un solo proyecto; registra la fecha de copia de seguridad. */
  exportProject: (id: string) => Promise<string | null>;
  deleteAll: () => Promise<void>;
  exportAll: () => Promise<string>;
  importFile: (json: string) => Promise<{ success: boolean; imported: number; errors: string[] }>;

  // Internal
  _repo: ProjectRepository;
  _saveTimer: ReturnType<typeof setTimeout> | null;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  current: null,
  saveStatus: 'idle',
  isMemoryOnly: false,

  _repo: new IndexedDbRepository(),
  _saveTimer: null,

  loadList: async () => {
    const repo = get()._repo;
    const list = await repo.list();
    set({
      projects: list,
      isMemoryOnly: (repo as IndexedDbRepository).isMemoryOnly,
    });
  },

  openProject: async (id: string) => {
    const repo = get()._repo;
    const project = await repo.get(id);
    if (project) {
      set({ current: project, saveStatus: 'idle' });
    }
  },

  createProject: async (meta?: Partial<ProjectMeta>) => {
    const repo = get()._repo;
    const base = createEmptyProject(meta);
    const project: Project = {
      ...base,
      finance: { ...base.finance, discountRatePct: getDefaultDiscountRatePct() },
    };
    await repo.save(project);
    await get().loadList();
    set({ current: project });
    return project.id;
  },

  updateProject: (project: Project) => {
    const now = new Date().toISOString();
    const updated = { ...project, updatedAt: now };
    set({ current: updated, saveStatus: 'guardando' });

    // Debounce autoguardado 600ms
    const existing = get()._saveTimer;
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
      const repo = get()._repo;
      try {
        await repo.save(updated);
        set({ saveStatus: 'guardado' });
        // Limpiar estado "guardado" después de 2 segundos
        setTimeout(() => {
          if (get().saveStatus === 'guardado') {
            set({ saveStatus: 'idle' });
          }
        }, 2000);
        await get().loadList();
      } catch {
        set({ saveStatus: 'error' });
      }
    }, 600);

    set({ _saveTimer: timer });
  },

  duplicateProject: async (id: string) => {
    const repo = get()._repo;
    const original = await repo.get(id);
    if (!original) return null;

    const now = new Date().toISOString();
    const copy: Project = {
      ...original,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      meta: {
        ...original.meta,
        name: `${original.meta.name} (copia)`,
      },
      lastExportedAt: undefined,
    };
    await repo.save(copy);
    await get().loadList();
    return copy.id;
  },

  deleteProject: async (id: string) => {
    const repo = get()._repo;
    await repo.delete(id);
    const current = get().current;
    if (current?.id === id) {
      set({ current: null });
    }
    await get().loadList();
  },

  getProject: async (id: string) => get()._repo.get(id),

  restoreProject: async (project: Project) => {
    await get()._repo.save(project);
    await get().loadList();
  },

  exportProject: async (id: string) => {
    const repo = get()._repo;
    const project = await repo.get(id);
    if (!project) return null;
    const json = JSON.stringify({ version: CURRENT_SCHEMA_VERSION, projects: [project] }, null, 2);
    await repo.save({ ...project, lastExportedAt: new Date().toISOString() });
    await get().loadList();
    return json;
  },

  deleteAll: async () => {
    const repo = get()._repo;
    const list = await repo.list();
    for (const item of list) await repo.delete(item.id);
    set({ current: null });
    await get().loadList();
  },

  exportAll: async () => {
    const repo = get()._repo;
    const json = await repo.exportAll();
    // Registra la copia en cada proyecto para el recordatorio de respaldo.
    const stamp = new Date().toISOString();
    const list = await repo.list();
    for (const item of list) {
      const p = await repo.get(item.id);
      if (p) await repo.save({ ...p, lastExportedAt: stamp });
    }
    await get().loadList();
    return json;
  },

  importFile: async (json: string) => {
    const repo = get()._repo;
    const result = await repo.importFile(json);
    await get().loadList();
    return result;
  },
}));
