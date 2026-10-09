import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: 'home', label: 'Inicio' },
  { to: '/p/current/datos', icon: 'folder_open', label: 'Proyecto' },
  { to: '/ajustes', icon: 'settings', label: 'Ajustes' },
];

export function NavRail() {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (to === '/p/current/datos') return location.pathname.startsWith('/p/');
    if (to === '/ajustes') return location.pathname === '/ajustes';
    return false;
  };

  return (
    <nav
      className="hidden md:flex flex-col items-center gap-1 w-16 shrink-0 border-r border-outline-variant/50 bg-surface-low pt-3"
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-md',
              'transition-colors duration-150 select-none group',
              active
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-on-surface/8',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className="material-symbols-rounded"
              style={{
                fontSize: 24,
                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
