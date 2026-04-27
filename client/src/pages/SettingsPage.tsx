import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Sun, Moon, Monitor, Bell, LogOut, Download, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/axios';
import { fadeInUp } from '@/lib/variants';
import type { Theme } from '@/types';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useUiStore();

  const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'auto', label: 'Automatique', icon: Monitor },
  ];

  const handleLogout = async () => {
    try { await api.post('/api/auth/logout'); } catch {}
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.section {...fadeInUp} className="rounded-2xl bg-bg-card border border-[#D0D0E8] dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Profil</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-xl bg-violet-600/30 flex items-center justify-center text-2xl font-bold text-violet-300">
            {user?.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-text-primary">{user?.username}</p>
            <p className="text-sm text-text-secondary">Niveau {user?.level} · {user?.xp} XP</p>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="rounded-2xl bg-bg-card border border-[#D0D0E8] dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Apparence</h2>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                theme === value ? 'border-2 border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300' : 'border-2 border-[#C8C8DC] dark:border-[#3A3A55] text-text-secondary hover:border-[#A0A0C0] dark:hover:border-violet-400/40'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="rounded-2xl bg-bg-card border border-[#D0D0E8] dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Bell size={18} /> Notifications
        </h2>
        <p className="text-sm text-text-secondary">Les notifications push nécessitent l'autorisation du navigateur.</p>
        <Button variant="secondary" size="sm" className="mt-3">
          <Bell size={14} /> Activer les notifications
        </Button>
      </motion.section>

      <motion.section {...fadeInUp} className="rounded-2xl bg-bg-card border border-[#D0D0E8] dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Données</h2>
        <div className="flex flex-col gap-3">
          <Button variant="secondary" size="sm" className="w-fit">
            <Download size={14} /> Exporter mes données (JSON)
          </Button>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="rounded-2xl bg-red-500/5 border border-red-500/20 p-6">
        <h2 className="text-base font-semibold text-red-400 mb-4">Zone de danger</h2>
        <Button variant="danger" onClick={handleLogout}>
          <LogOut size={16} /> Se déconnecter
        </Button>
      </motion.section>
    </div>
  );
}
