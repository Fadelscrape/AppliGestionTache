import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const LEVELS = [0, 500, 1500, 3500, 7000, 12000, 20000, 32000, 50000, 75000, 100000];
const LEVEL_NAMES = ['Novice', 'Apprenti', 'Intermédiaire', 'Avancé', 'Expert', 'Maître', 'Grand Maître', 'Élite', 'Légende', 'Mythique', 'Dieu'];

interface XPBarProps {
  xp: number;
  level: number;
  compact?: boolean;
}

export function XPBar({ xp, level, compact = false }: XPBarProps) {
  const currentThreshold = LEVELS[level - 1] ?? 0;
  const nextThreshold = LEVELS[level] ?? LEVELS[LEVELS.length - 1];
  const progress = Math.min(1, (xp - currentThreshold) / (nextThreshold - currentThreshold));
  const levelName = LEVEL_NAMES[level - 1] ?? 'Légende';

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Niv. {level} — {levelName}</span>
          <span>{xp} XP</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl bg-violet-600/20 flex items-center justify-center">
          <Zap size={22} className="text-violet-400" />
        </div>
        <div>
          <p className="text-lg font-bold text-text-primary">Niveau {level}</p>
          <p className="text-sm text-text-secondary">{levelName}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xl font-bold text-text-primary">{xp.toLocaleString()}</p>
          <p className="text-xs text-text-secondary">XP total</p>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-text-secondary">
          <span>{(xp - currentThreshold).toLocaleString()} XP dans ce niveau</span>
          <span>Prochain : {(nextThreshold - xp).toLocaleString()} XP</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
