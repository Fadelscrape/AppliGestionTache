import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { PomodoroTimer } from '@/components/focus/PomodoroTimer';
import { XPBar } from '@/components/gamification/XPBar';
import { StreakBadge } from '@/components/gamification/StreakBadge';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/variants';
import type { Task } from '@/types';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { tasks, isLoading, fetchTodayTasks, completeTask, deleteTask, createTask } = useTasks();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTodayTasks(); }, []);

  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? doneTasks / totalTasks : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference - progress * circumference;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">

        {/* Hero card */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-400/5 dark:from-[#1E1B4B] dark:to-[#2D1B69] border border-violet-300/30 dark:border-violet-500/30 p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none" stroke="#7c3aed" strokeWidth="10"
                  strokeDasharray={circumference} strokeDashoffset={strokeDash}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDash }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">{Math.round(progress * 100)}%</span>
                <span className="text-xs text-text-secondary">du jour</span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                {greeting()}, {user?.username} !
              </h2>
              <p className="text-text-secondary mt-1 text-sm sm:text-base">
                {doneTasks === 0
                  ? "Aucune tâche complétée pour l'instant."
                  : doneTasks === totalTasks
                  ? '🎉 Toutes les tâches sont terminées !'
                  : `${doneTasks} sur ${totalTasks} tâches complétées.`}
              </p>
            </div>

            {user && <StreakBadge current={user.streakCurrent} best={user.streakBest} compact />}
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Task list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary">Tâches du jour</h3>
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Ajouter
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onComplete={completeTask}
                onDelete={deleteTask}
                emptyMessage="Aucune tâche pour aujourd'hui. Profitez-en !"
              />
            )}
          </div>

          {/* Sidebar widgets */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary">Focus</h3>
            <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-5">
              <PomodoroTimer compact />
            </div>
            {user && <XPBar xp={user.xp} level={user.level} compact />}
          </div>
        </div>
      </motion.div>

      <TaskForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={async (data) => { await createTask(data as Task); }}
      />
    </div>
  );
}
