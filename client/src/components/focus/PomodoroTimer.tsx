import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  compact?: boolean;
}

const PHASE_COLORS = { work: '#7c3aed', break: '#10b981', long: '#3b82f6' };
const PHASE_LABELS = { work: 'Travail', break: 'Pause', long: 'Longue pause' };

export function PomodoroTimer({ compact = false }: PomodoroTimerProps) {
  const { phase, display, isRunning, pomodorosDone, progress, start, pause, reset } = usePomodoro();

  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference - progress * circumference;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-bg-input border border-gray-200 dark:border-[#3A3A55]">
        <div className="relative h-10 w-10">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" className="dark:stroke-white/10" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={PHASE_COLORS[phase]} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={strokeDash} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">{display.split(':')[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-secondary">{PHASE_LABELS[phase]}</p>
          <p className="text-sm font-bold text-text-primary">{display}</p>
        </div>
        <button onClick={isRunning ? pause : start} className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-600/30 transition-colors">
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-6">
        {(['work', 'break', 'long'] as const).map((p) => (
          <span key={p} className={cn('px-3 py-1 rounded-full text-xs font-medium', phase === p ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400')}>
            {PHASE_LABELS[p]}
          </span>
        ))}
      </div>

      <div className="relative h-48 w-48 mb-6">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" className="dark:stroke-white/5" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={PHASE_COLORS[phase]} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
            animate={{ strokeDashoffset: strokeDash }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-text-primary tabular-nums">{display}</span>
          <span className="text-xs text-text-secondary mt-1">{PHASE_LABELS[phase]}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={cn('h-2.5 w-2.5 rounded-full transition-colors', i < (pomodorosDone % 4) ? 'bg-violet-500' : 'bg-gray-300 dark:bg-white/10')} />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={16} /></Button>
        <Button size="md" onClick={isRunning ? pause : start} className="min-w-[120px]">
          {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Démarrer</>}
        </Button>
        <Button variant="ghost" size="sm"><Coffee size={16} /></Button>
      </div>
    </div>
  );
}
