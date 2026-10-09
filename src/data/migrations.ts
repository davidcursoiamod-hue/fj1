import type { Project } from './schema';

export interface Migration {
  fromVersion: number;
  toVersion: number;
  migrate(project: Project): Project | Promise<Project>;
}

/**
 * Arreglo de migraciones. Cada migración transforma un proyecto
 * de fromVersion a toVersion. Se aplican en orden.
 * Por ahora está vacío (schemaVersion = 1).
 */
export const MIGRATIONS: Migration[] = [];

/**
 * Aplica todas las migraciones necesarias a un proyecto.
 * @param project Proyecto cargado desde almacenamiento
 * @param targetVersion Versión actual del esquema
 */
export async function runMigrations(
  project: Project,
  targetVersion: number,
): Promise<Project> {
  let current = project;
  let version = current.schemaVersion;

  while (version < targetVersion) {
    const migration = MIGRATIONS.find((m) => m.fromVersion === version);
    if (!migration) break;
    current = await migration.migrate(current);
    version = current.schemaVersion;
  }

  return current;
}

export const CURRENT_SCHEMA_VERSION = 1;
