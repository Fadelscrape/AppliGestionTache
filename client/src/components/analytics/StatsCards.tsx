import { motion } from 'framer-motion';
import { CheckCircle, Flame, Zap, TrendingUp } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/variants';
import type { AnalyticsSummary } from '@/types';

interface StatsCardsProps {
  summary: AnalyticsSummary;
}

export function StatsCards({ summary }: StatsCardsProps) {
  const cards = [
    {
      icon: CheckCircle,
      label: "Terminées aujourd'hui",
      value: `${summary.todayCompleted}/${summary.todayTotal}`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Cette semaine',
      value: summary.weekCompleted,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Flame,
      label: 'Streak actuel',
      value: `${summary.streakCurrent}j`,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      icon: Zap,
      label: 'XP total',
      value: summary.totalXP.toLocaleString(),
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={fadeInUp}
          className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-5"
        >
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} mb-3`}>
            <card.icon size={20} className={card.color} />
          </div>
          <p className="text-2xl font-bold text-text-primary">{card.value}</p>
          <p className="text-sm text-text-secondary mt-1">{card.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
