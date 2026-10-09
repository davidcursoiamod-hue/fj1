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

export function BottomNav() {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (to === '/p/current/datos') return location.pathname.startsWith('/p/');
    if (to === '/ajustes') return location.pathname === '/ajustes';
    return false;
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-sm border-t border-outline-variant/50"
      aria-label="Navegación inferior"
    >
      <div className="flex items-stretch justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors duration-150',
                active
                  ? 'text-primary'
                  : 'text-on-surface-variant',
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
      </div>
    </nav>
  );
}
