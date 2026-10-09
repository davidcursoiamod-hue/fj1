import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  init: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemTheme() : mode;
}

const STORAGE_KEY = 'formula-theme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  resolved: 'light',
  setMode: (mode) => {
    const resolved = resolveTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(resolved);
    set({ mode, resolved });
  },
  toggle: () => {
    const current = get().resolved;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setMode(next);
  },
  init: () => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system';
    const resolved = resolveTheme(stored);
    applyTheme(resolved);
    set({ mode: stored, resolved });

    if (stored === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', (e) => {
        if (get().mode === 'system') {
          const r = e.matches ? 'dark' : 'light';
          applyTheme(r);
          set({ resolved: r });
        }
      });
    }
  },
}));
