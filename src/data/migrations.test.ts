import { describe, it, expect } from 'vitest';
import { runMigrations, MIGRATIONS } from './migrations';
import type { Project } from './schema';

describe('migrations', () => {
  it('MIGRATIONS is an array (empty for now)', () => {
    expect(Array.isArray(MIGRATIONS)).toBe(true);
    expect(MIGRATIONS.length).toBe(0);
  });

  it('runMigrations returns the project unchanged when no migrations', async () => {
    const project = {
      id: 'test',
      schemaVersion: 1,
    } as unknown as Project;
    const result = await runMigrations(project, 1);
    expect(result).toBe(project);
  });
});
