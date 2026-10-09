import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { APP_NAME } from '@/config';
import { Logo } from '@/components/ui/Logo';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';

export function AppBar() {
  const toggle = useThemeStore((s) => s.toggle);
  const resolved = useThemeStore((s) => s.resolved);
  const location = useLocation();

  const isInProject = location.pathname.startsWith('/p/');

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-sm border-b border-outline-variant/50">
      <div className="flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center" aria-label={`${APP_NAME} — Inicio`}>
          <Logo size={32} />
        </Link>
        <div className="flex items-center gap-1">
          <Tooltip content={resolved === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            <IconButton
              icon={resolved === 'dark' ? 'light_mode' : 'dark_mode'}
              label="Alternar tema"
              size="sm"
              onClick={toggle}
            />
          </Tooltip>
          {!isInProject && (
            <Tooltip content="Ajustes">
              <IconButton icon="settings" label="Ajustes" size="sm" />
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}
