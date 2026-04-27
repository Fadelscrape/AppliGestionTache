import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  current: number;
  best: number;
  compact?: boolean;
}

export function StreakBadge({ current, best, compact = false }: StreakBadgeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame size={16} className="text-orange-400" />
        </motion.div>
        <span className="text-sm font-bold text-orange-300">{current}</span>
        <span className="text-xs text-orange-400/60">jours</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-5">
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: current > 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center"
        >
          <Flame size={28} className={current > 0 ? 'text-orange-400' : 'text-text-secondary'} />
        </motion.div>
        <div>
          <p className="text-3xl font-bold text-text-primary">{current}<span className="text-lg text-text-secondary ml-1">jours</span></p>
          <p className="text-sm text-text-secondary">Meilleur : {best} jours</p>
        </div>
      </div>
    </div>
  );
}
