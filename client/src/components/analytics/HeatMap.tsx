import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { HeatmapEntry } from '@/types';

interface HeatMapProps {
  data: HeatmapEntry[];
}

function getIntensity(count: number): string {
  if (count === 0) return 'bg-white/5';
  if (count <= 2) return 'bg-emerald-900/60';
  if (count <= 5) return 'bg-emerald-700/70';
  if (count <= 8) return 'bg-emerald-500/80';
  return 'bg-emerald-400';
}

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const DAYS = ['Dim', '', 'Mar', '', 'Jeu', '', 'Sam'];

export function HeatMap({ data }: HeatMapProps) {
  const grid = useMemo(() => {
    const map = new Map(data.map((d) => [d.date, d.count]));
    const today = new Date();
    const yearAgo = new Date(today);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const weeks: Array<Array<{ date: string; count: number } | null>> = [];
    const current = new Date(yearAgo);
    current.setDate(current.getDate() - current.getDay());

    while (current <= today) {
      const week: Array<{ date: string; count: number } | null> = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toISOString().split('T')[0];
        if (current < yearAgo || current > today) {
          week.push(null);
        } else {
          week.push({ date: dateStr, count: map.get(dateStr) ?? 0 });
        }
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [data]);

  return (
    <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] p-6 overflow-x-auto">
      <h3 className="text-base font-semibold text-text-primary mb-4">Activité sur 365 jours</h3>
      <div className="flex gap-1 min-w-max">
        <div className="flex flex-col gap-1 mr-1 pt-6">
          {DAYS.map((d, i) => (
            <div key={i} className="h-3 text-xs text-text-secondary leading-3 w-6">{d}</div>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day ? `${day.date}: ${day.count} tâche${day.count !== 1 ? 's' : ''}` : ''}
                className={cn('h-3 w-3 rounded-sm transition-colors', day ? getIntensity(day.count) : 'invisible')}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
        <span>Moins</span>
        {[0, 2, 5, 8, 10].map((c) => (
          <div key={c} className={cn('h-3 w-3 rounded-sm', getIntensity(c))} />
        ))}
        <span>Plus</span>
      </div>
    </div>
  );
}
