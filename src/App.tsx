import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { useThemeStore } from '@/store/themeStore';
import { SnackbarProvider } from '@/components/ui/Snackbar';

export default function App() {
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AppRoutes />
      </SnackbarProvider>
    </BrowserRouter>
  );
}
