import { type ReactNode } from 'react';
import { AppBar } from './AppBar';
import { NavRail } from './NavRail';
import { BottomNav } from './BottomNav';
import { PageTransition } from './PageTransition';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppBar />
      <div className="flex flex-1 min-h-0">
        <NavRail />
        <main className="flex-1 min-w-0 flex flex-col pb-16 md:pb-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
