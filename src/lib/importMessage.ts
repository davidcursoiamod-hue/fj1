import type { ImportResult } from '@/data/repository';

export interface ImportMessage {
  message: string;
  variant: 'success' | 'default' | 'error';
}

/** Convierte el resultado de una importación en un mensaje comprensible para el usuario. */
export function describeImportResult(result: ImportResult): ImportMessage {
  const plural = result.imported === 1 ? 'proyecto importado' : 'proyectos importados';

  if (result.imported > 0 && result.errors.length === 0) {
    return { message: `${result.imported} ${plural} correctamente.`, variant: 'success' };
  }
  if (result.imported > 0) {
    return {
      message: `${result.imported} ${plural}; ${result.errors.length} dato(s) del archivo no eran válidos y se omitieron.`,
      variant: 'default',
    };
  }
  const first = result.errors[0] ?? '';
  if (first.startsWith('El archivo no es JSON')) {
    return { message: first, variant: 'error' };
  }
  return {
    message: 'El archivo no tiene el formato de un proyecto de Formula. Usa una copia descargada desde esta aplicación.',
    variant: 'error',
  };
}
