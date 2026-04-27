import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckSquare, Columns, BarChart2, Timer, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { fadeIn, scaleIn } from '@/lib/variants';

const COMMANDS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: CheckSquare, path: '/dashboard' },
  { id: 'kanban', label: 'Vue Kanban', icon: Columns, path: '/kanban' },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, path: '/analytics' },
  { id: 'focus', label: 'Mode Focus', icon: Timer, path: '/focus' },
  { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' },
  { id: 'new-task', label: 'Nouvelle tâche', icon: Plus, path: '/dashboard?new=1' },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const select = useCallback((path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
    setQuery('');
  }, [navigate, setCommandPaletteOpen]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div {...fadeIn} className="absolute inset-0 bg-black/60" onClick={() => setCommandPaletteOpen(false)} />
          <motion.div {...scaleIn} className="relative w-full max-w-lg rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une action..."
                className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm"
              />
              <kbd className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">Esc</kbd>
            </div>
            <ul className="py-2 max-h-72 overflow-y-auto">
              {filtered.map((cmd) => (
                <li key={cmd.id}>
                  <button
                    onClick={() => select(cmd.path)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-violet-500/10 hover:text-white transition-colors"
                  >
                    <cmd.icon size={16} className="text-violet-400" />
                    {cmd.label}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-gray-500">Aucun résultat</li>
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
