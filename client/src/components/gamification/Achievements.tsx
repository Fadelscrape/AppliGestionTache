import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/variants';

const ALL_ACHIEVEMENTS = [
  { id: 'first_task', label: 'Premier Pas', desc: 'Complète ta 1ère tâche', emoji: '🌱' },
  { id: 'streak_7', label: 'Série de 7 jours', desc: '7 jours consécutifs', emoji: '🔥' },
  { id: 'streak_30', label: 'Mois parfait', desc: '30 jours consécutifs', emoji: '💎' },
  { id: 'tasks_100', label: 'Centenaire', desc: '100 tâches complétées', emoji: '💯' },
  { id: 'tasks_10_day', label: 'Productivité Max', desc: '10 tâches en un jour', emoji: '⚡' },
  { id: 'level_5', label: 'Expert', desc: 'Atteindre le niveau 5', emoji: '🏆' },
  { id: 'pomodoro_25', label: 'Maître Focus', desc: '25 pomodoros complétés', emoji: '🍅' },
  { id: 'urgent_5', label: 'Pompier', desc: '5 tâches urgentes', emoji: '🚒' },
  { id: 'early_10', label: 'Ponctuel', desc: '10 tâches avant échéance', emoji: '⏰' },
  { id: 'night_owl', label: 'Oiseau de nuit', desc: 'Tâche après 22h', emoji: '🦉' },
];

interface AchievementsProps {
  unlocked: string[];
}

export function Achievements({ unlocked }: AchievementsProps) {
  return (
    <div className="rounded-2xl bg-bg-card border border-[#D0D0E8] dark:border-[#3A3A55] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={18} className="text-violet-400" />
        <h3 className="text-base font-semibold text-text-primary">Achievements ({unlocked.length}/{ALL_ACHIEVEMENTS.length})</h3>
      </div>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      >
        {ALL_ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <motion.div
              key={a.id}
              variants={fadeInUp}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-colors ${
                isUnlocked ? 'border-2 border-violet-300 dark:border-violet-500/30 bg-violet-500/5' : 'border border-[#D0D0E8] dark:border-white/5 bg-gray-50 dark:bg-transparent opacity-40'
              }`}
              title={a.desc}
            >
              <span className="text-2xl">{isUnlocked ? a.emoji : '🔒'}</span>
              <p className="text-xs font-medium text-text-secondary leading-tight">{a.label}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
