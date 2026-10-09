import { get, set, del, keys, createStore } from 'idb-keyval';
import { projectSchema, toSummary, type Project, type ProjectSummary } from './schema';
import type { ProjectRepository, ImportResult } from './repository';
import { runMigrations, CURRENT_SCHEMA_VERSION } from './migrations';

const STORE = createStore('formula-db', 'projects');
const KEY_PREFIX = 'project:';
const INDEX_KEY = '_index';

function projectKey(id: string): string {
  return KEY_PREFIX + id;
}

export class IndexedDbRepository implements ProjectRepository {
  private memoryFallback = false;
  private memoryStore = new Map<string, Project>();

  private async isAvailable(): Promise<boolean> {
    if (this.memoryFallback) return false;
    try {
      // Test IDB availability
      if (typeof indexedDB === 'undefined') {
        this.memoryFallback = true;
        return false;
      }
      return true;
    } catch {
      this.memoryFallback = true;
      return false;
    }
  }

  get isMemoryOnly(): boolean {
    return this.memoryFallback;
  }

  async list(): Promise<ProjectSummary[]> {
    if (!(await this.isAvailable())) {
      return Array.from(this.memoryStore.values())
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map(toSummary);
    }
    const indexIds = (await get<string[]>(INDEX_KEY, STORE)) ?? [];
    const summaries: ProjectSummary[] = [];
    for (const id of indexIds) {
      const raw = await get<Project>(projectKey(id), STORE);
      if (raw) summaries.push(toSummary(raw));
    }
    return summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string): Promise<Project | null> {
    if (!(await this.isAvailable())) {
      const p = this.memoryStore.get(id);
      if (!p) return null;
      return runMigrations(p, CURRENT_SCHEMA_VERSION);
    }
    const raw = await get<Project>(projectKey(id), STORE);
    if (!raw) return null;
    return runMigrations(raw, CURRENT_SCHEMA_VERSION);
  }

  async save(project: Project): Promise<void> {
    if (!(await this.isAvailable())) {
      this.memoryStore.set(project.id, project);
      return;
    }
    await set(projectKey(project.id), project, STORE);
    // Update index
    const indexIds = (await get<string[]>(INDEX_KEY, STORE)) ?? [];
    if (!indexIds.includes(project.id)) {
      indexIds.push(project.id);
      await set(INDEX_KEY, indexIds, STORE);
    }
  }

  async delete(id: string): Promise<void> {
    if (!(await this.isAvailable())) {
      this.memoryStore.delete(id);
      return;
    }
    await del(projectKey(id), STORE);
    const indexIds = (await get<string[]>(INDEX_KEY, STORE)) ?? [];
    const newIndex = indexIds.filter((x) => x !== id);
    await set(INDEX_KEY, newIndex, STORE);
  }

  async exportAll(): Promise<string> {
    const allProjects: Project[] = [];
    if (!(await this.isAvailable())) {
      for (const p of this.memoryStore.values()) allProjects.push(p);
    } else {
      const allKeys = await keys(STORE);
      for (const key of allKeys) {
        if (typeof key === 'string' && key.startsWith(KEY_PREFIX)) {
          const p = await get<Project>(key, STORE);
          if (p) allProjects.push(p);
        }
      }
    }
    return JSON.stringify({ version: CURRENT_SCHEMA_VERSION, projects: allProjects }, null, 2);
  }

  async importFile(json: string): Promise<ImportResult> {
    const errors: string[] = [];
    let imported = 0;

    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { success: false, imported: 0, errors: ['El archivo no es JSON válido.'] };
    }

    const projects: unknown[] = Array.isArray(parsed)
      ? parsed
      : (parsed as Record<string, unknown>)?.projects
        ? ((parsed as Record<string, unknown>).projects as unknown[])
        : [parsed];

    for (const item of projects) {
      const result = projectSchema.safeParse(item);
      if (result.success) {
        await this.save(result.data);
        imported++;
      } else {
        const msgs = result.error.issues.map(
          (i) => `${i.path.join('.')}: ${i.message}`,
        );
        errors.push(...msgs);
      }
    }

    return { success: errors.length === 0, imported, errors };
  }
}
