import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatsCards } from '@/components/analytics/StatsCards';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { HeatMap } from '@/components/analytics/HeatMap';
import { Achievements } from '@/components/gamification/Achievements';
import { XPBar } from '@/components/gamification/XPBar';
import { StreakBadge } from '@/components/gamification/StreakBadge';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import type { AnalyticsSummary, HeatmapEntry, WeeklyEntry, PriorityEntry } from '@/types';

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444', high: '#f97316', medium: '#3b82f6', low: '#6b7280',
};
const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgent', high: 'Haute', medium: 'Moyenne', low: 'Basse',
};

export default function AnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [weekly, setWeekly] = useState<WeeklyEntry[]>([]);
  const [priorities, setPriorities] = useState<PriorityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/analytics/summary'),
      api.get('/api/analytics/heatmap'),
      api.get('/api/analytics/weekly'),
      api.get('/api/analytics/priorities'),
    ]).then(([s, h, w, p]) => {
      setSummary(s.data.data);
      setHeatmap(h.data.data.heatmap);
      setWeekly(w.data.data.weekly);
      setPriorities(p.data.data.priorities);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse" />)}
      </div>
    );
  }

  const pieData = priorities.map((p) => ({
    name: PRIORITY_LABELS[p.priority] ?? p.priority,
    value: p.count,
    color: PRIORITY_COLORS[p.priority] ?? '#6b7280',
  }));

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      {summary && <StatsCards summary={summary} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <WeeklyChart data={weekly} />
        </div>
        <div className="rounded-2xl bg-bg-card border border-[#D0D0E8] dark:border-[#3A3A55] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-5">
          <h3 className="text-base font-semibold text-text-primary mb-4">Par priorité</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  color: 'var(--text-primary)',
                }}
                formatter={(value, name) => [value, name]}
              />
              <Legend formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <HeatMap data={heatmap} />

      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <XPBar xp={user.xp} level={user.level} />
          <StreakBadge current={user.streakCurrent} best={user.streakBest} />
        </div>
      )}

      {user && <Achievements unlocked={user.achievements} />}
    </div>
  );
}
