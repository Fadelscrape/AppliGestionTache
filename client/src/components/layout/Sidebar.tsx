import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Columns, Calendar, BarChart2,
  Timer, Settings, Zap, Flame, X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: "Aujourd'hui" },
  { to: '/kanban', icon: Columns, label: 'Kanban' },
  { to: '/calendar', icon: Calendar, label: 'Calendrier' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/focus', icon: Timer, label: 'Focus' },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-40 h-full w-64 bg-bg-sidebar border-r border-[#D0D0E8] dark:border-[#45456a] flex flex-col shadow-sm lg:relative lg:translate-x-0"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-[#D0D0E8] dark:border-[#45456a]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-text-primary text-lg">TaskMaster</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-secondary hover:text-text-primary p-1">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-400'
                        : 'text-text-secondary hover:text-text-primary hover:bg-[#EEEEF8] dark:hover:bg-[#252540]'
                    )
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {user && (
              <div className="border-t border-[#D0D0E8] dark:border-[#45456a] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-full bg-violet-100 dark:bg-violet-600/30 flex items-center justify-center text-sm font-bold text-violet-700 dark:text-violet-300">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{user.username}</p>
                    <p className="text-xs text-text-secondary">Niveau {user.level}</p>
                  </div>
                  <NavLink to="/settings" className="text-text-secondary hover:text-text-primary p-1">
                    <Settings size={16} />
                  </NavLink>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400" /> {user.streakCurrent}j</span>
                    <span>{user.xp} XP</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#E0E0EE] dark:bg-[#252540] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (user.xp % 500) / 5)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
