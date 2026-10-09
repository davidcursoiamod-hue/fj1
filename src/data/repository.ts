import type { Project, ProjectSummary } from '@/data/schema';

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

export interface ProjectRepository {
  list(): Promise<ProjectSummary[]>;
  get(id: string): Promise<Project | null>;
  save(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  exportAll(): Promise<string>;
  importFile(json: string): Promise<ImportResult>;
}

export class NotImplementedError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'NotImplementedError';
  }
}
