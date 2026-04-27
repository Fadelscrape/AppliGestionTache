import { Menu, Search, Bell, Plus } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

interface TopBarProps {
  title?: string;
  onNewTask?: () => void;
}

export function TopBar({ title, onNewTask }: TopBarProps) {
  const { toggleSidebar, setCommandPaletteOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 border-b border-[#D0D0E8] dark:border-[#45456a] bg-white/90 dark:bg-[#181825] backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        {title && <h1 className="text-lg font-semibold text-text-primary">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#252540] border border-[#D0D0E8] dark:border-[#45456a] text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          <Search size={14} />
          <span>Rechercher</span>
          <kbd className="ml-2 text-xs bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        {onNewTask && (
          <Button size="sm" onClick={onNewTask} className="hidden md:inline-flex">
            <Plus size={16} />
            Nouvelle tâche
          </Button>
        )}

        <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-violet-500 rounded-full" />
        </button>

        <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-600/30 flex items-center justify-center text-sm font-bold text-violet-700 dark:text-violet-300">
          {user?.username[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
