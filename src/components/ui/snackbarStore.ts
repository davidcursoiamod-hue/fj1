export type SnackbarVariant = 'default' | 'success' | 'error';

export interface SnackbarState {
  message: string;
  variant: SnackbarVariant;
  actionLabel?: string;
  onAction?: () => void;
}

let showFn: ((state: SnackbarState) => void) | null = null;

export function showSnackbar(
  message: string,
  variant: SnackbarVariant = 'default',
  actionLabel?: string,
  onAction?: () => void,
): void {
  showFn?.({ message, variant, actionLabel, onAction });
}

export function _registerSnackbarShow(fn: ((state: SnackbarState) => void) | null): void {
  showFn = fn;
}
