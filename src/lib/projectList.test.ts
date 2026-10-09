import { describe, it, expect } from 'vitest';
import { filterAndSort, type ProjectListItem } from '@/lib/projectList';

function item(name: string, updatedAt: string, overall: number, sector = '', municipality = ''): ProjectListItem {
  return { summary: { id: name, name, sector, municipality, updatedAt }, overall };
}

const items = [
  item('Acueducto rural', '2026-03-01T00:00:00Z', 40, 'Ambiente', 'Popayán'),
  item('Ñandú: criadero', '2026-05-01T00:00:00Z', 10, 'Agricultura', 'Timbío'),
  item('Biblioteca', '2026-04-01T00:00:00Z', 90, 'Cultura', 'Popayán'),
];

describe('filterAndSort', () => {
  it('ordena por más recientes', () => {
    expect(filterAndSort(items, '', 'recientes').map((i) => i.summary.name)).toEqual([
      'Ñandú: criadero', 'Biblioteca', 'Acueducto rural',
    ]);
  });
  it('ordena por nombre con criterio del español', () => {
    expect(filterAndSort(items, '', 'nombre').map((i) => i.summary.name)).toEqual([
      'Acueducto rural', 'Biblioteca', 'Ñandú: criadero',
    ]);
  });
  it('ordena por avance descendente', () => {
    expect(filterAndSort(items, '', 'avance').map((i) => i.overall)).toEqual([90, 40, 10]);
  });
  it('filtra sin distinguir tildes ni mayúsculas', () => {
    expect(filterAndSort(items, 'POPAYAN', 'nombre').map((i) => i.summary.name)).toEqual([
      'Acueducto rural', 'Biblioteca',
    ]);
  });
  it('filtra por sector y devuelve vacío si no hay coincidencias', () => {
    expect(filterAndSort(items, 'ambiente', 'nombre').map((i) => i.summary.name)).toEqual(['Acueducto rural']);
    expect(filterAndSort(items, 'cultura', 'nombre')).toHaveLength(2); // Agricultura y Cultura
    expect(filterAndSort(items, 'zzz', 'nombre')).toHaveLength(0);
  });
  it('no modifica el arreglo original', () => {
    const copy = items.map((i) => i.summary.name);
    filterAndSort(items, '', 'nombre');
    expect(items.map((i) => i.summary.name)).toEqual(copy);
  });
});
