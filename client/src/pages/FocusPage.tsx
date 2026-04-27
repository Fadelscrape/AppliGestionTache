import { useState } from 'react';
import { motion } from 'framer-motion';
import { PomodoroTimer } from '@/components/focus/PomodoroTimer';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import { fadeInUp } from '@/lib/variants';

export default function FocusPage() {
  const tasks = useTaskStore((s) => s.tasks.filter((t) => t.status === 'doing' && !t.deletedAt));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-bg-primary">
      <motion.div {...fadeInUp} className="w-full max-w-lg text-center">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-2">Mode Focus</h2>
        <h1 className="text-2xl font-bold text-text-primary mb-8">
          {selectedTask ? selectedTask.title : 'Sélectionnez une tâche'}
        </h1>

        <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-8 mb-6">
          <PomodoroTimer />
        </div>

        {tasks.length > 0 && (
          <div className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-4">
            <p className="text-xs text-text-secondary mb-3">Tâches en cours</p>
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task._id}
                  onClick={() => setSelectedTask(task._id === selectedTask?._id ? null : task)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl text-sm transition-colors',
                    task._id === selectedTask?._id
                      ? 'bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-500/30'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                  )}
                >
                  {task.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <p className="text-sm text-text-secondary">
            Passez une tâche en statut "En cours" pour la sélectionner ici.
          </p>
        )}
      </motion.div>
    </div>
  );
}
