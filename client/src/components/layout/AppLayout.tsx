import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '@/components/ui/CommandPalette';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': "Aujourd'hui",
  '/kanban': 'Kanban',
  '/calendar': 'Calendrier',
  '/analytics': 'Analytics',
  '/focus': 'Focus',
  '/settings': 'Paramètres',
};

export function AppLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname];

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
