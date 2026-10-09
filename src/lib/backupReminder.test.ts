import { describe, it, expect } from 'vitest';
import { shouldShowBackupReminder } from '@/lib/backupReminder';
import type { ProjectSummary } from '@/data/schema';

const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;

describe('shouldShowBackupReminder', () => {
  it('sin proyectos → false', () => {
    expect(shouldShowBackupReminder([])).toBe(false);
  });

  it('proyecto exportado hace menos de 14 días → false', () => {
    const recently = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const projects: ProjectSummary[] = [
      { id: '1', name: 'P', sector: 's', municipality: 'm', updatedAt: recently, lastExportedAt: recently },
    ];
    expect(shouldShowBackupReminder(projects)).toBe(false);
  });

  it('proyecto exportado hace más de 14 días → true', () => {
    const old = new Date(Date.now() - FOURTEEN_DAYS - 1).toISOString();
    const projects: ProjectSummary[] = [
      { id: '1', name: 'P', sector: 's', municipality: 'm', updatedAt: old, lastExportedAt: old },
    ];
    expect(shouldShowBackupReminder(projects)).toBe(true);
  });

  it('proyecto sin exportar, actualizado hace más de 14 días → true', () => {
    const old = new Date(Date.now() - FOURTEEN_DAYS - 1).toISOString();
    const projects: ProjectSummary[] = [
      { id: '1', name: 'P', sector: 's', municipality: 'm', updatedAt: old },
    ];
    expect(shouldShowBackupReminder(projects)).toBe(true);
  });

  it('proyecto sin exportar, actualizado hace menos de 14 días → false', () => {
    const recent = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const projects: ProjectSummary[] = [
      { id: '1', name: 'P', sector: 's', municipality: 'm', updatedAt: recent },
    ];
    expect(shouldShowBackupReminder(projects)).toBe(false);
  });
});
