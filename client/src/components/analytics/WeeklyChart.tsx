import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { WeeklyEntry } from '@/types';

interface WeeklyChartProps {
  data: WeeklyEntry[];
}

const DAY_LABELS: Record<string, string> = {
  '0': 'Dim', '1': 'Lun', '2': 'Mar', '3': 'Mer',
  '4': 'Jeu', '5': 'Ven', '6': 'Sam',
};

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.map((d) => ({
    day: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(new Date(d.date)),
    count: d.count,
  }));

  return (
    <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-6">
      <h3 className="text-base font-semibold text-text-primary mb-4">Tâches par jour (7 derniers jours)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={32}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            contentStyle={{ backgroundColor: '#242436', border: '1px solid #3A3A55', borderRadius: 12, color: '#F0F0FF' }}
            cursor={{ fill: 'rgba(124,58,237,0.1)' }}
          />
          <Bar dataKey="count" name="Tâches" fill="#7c3aed" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
