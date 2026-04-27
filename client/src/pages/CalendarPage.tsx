import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { cn, formatDate } from '@/lib/utils';
import { fadeInUp } from '@/lib/variants';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { tasks, fetchTasks, completeTask, deleteTask } = useTasks();

  useEffect(() => { fetchTasks(); }, []);

  const { year, month } = { year: currentDate.getFullYear(), month: currentDate.getMonth() };

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startOffset = (first.getDay() + 6) % 7;
    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
    return cells;
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = t.dueDate.split('T')[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return map;
  }, [tasks]);

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().split('T')[0];
    return tasksByDate.get(key) ?? [];
  }, [selectedDate, tasksByDate]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();
  const isSelected = (d: Date) => selectedDate?.toDateString() === d.toDateString();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-[0_2px_8px_rgba(0,0,0,0.25)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary capitalize">
                {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate)}
              </h2>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-input rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                <button onClick={nextMonth} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-input rounded-lg transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-text-secondary py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (!day) return <div key={i} />;
                const key = day.toISOString().split('T')[0];
                const dayTasks = tasksByDate.get(key) ?? [];
                const priorities = [...new Set(dayTasks.map((t) => t.priority))];

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 p-1 transition-colors text-sm',
                      isToday(day) && 'bg-violet-600 text-white font-bold',
                      isSelected(day) && !isToday(day) && 'bg-violet-600/20 text-violet-300',
                      !isToday(day) && !isSelected(day) && 'text-text-primary hover:bg-bg-input'
                    )}
                  >
                    {day.getDate()}
                    {dayTasks.length > 0 && (
                      <div className="flex gap-0.5">
                        {priorities.slice(0, 3).map((p) => (
                          <div key={p} className={cn('h-1 w-1 rounded-full', {
                            urgent: 'bg-red-500', high: 'bg-orange-500',
                            medium: 'bg-blue-500', low: 'bg-gray-500',
                          }[p])} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {selectedDate ? (
            <motion.div {...fadeInUp}>
              <h3 className="text-base font-semibold text-text-primary mb-3">{formatDate(selectedDate)}</h3>
              <TaskList
                tasks={selectedTasks}
                onComplete={completeTask}
                onDelete={deleteTask}
                emptyMessage="Aucune tâche ce jour-là"
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <p>Sélectionnez un jour</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
