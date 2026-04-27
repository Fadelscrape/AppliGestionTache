import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { staggerContainer, fadeInUp } from '@/lib/variants';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onTaskClick?: (task: Task) => void;
  emptyMessage?: string;
}

export function TaskList({ tasks, onComplete, onDelete, onTaskClick, emptyMessage }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div {...fadeInUp} className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <span className="text-3xl">✨</span>
        </div>
        <p className="text-gray-400">{emptyMessage ?? 'Aucune tâche'}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            onClick={onTaskClick}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
