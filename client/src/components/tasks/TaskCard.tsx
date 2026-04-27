import { motion } from 'framer-motion';
import { Check, Clock, Trash2, ChevronRight } from 'lucide-react';
import { cn, formatRelativeDate, priorityBorder } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Task, TaskPriority } from '@/types';
import { fadeInUp } from '@/lib/variants';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (task: Task) => void;
  dragging?: boolean;
}

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  urgent: 'Urgent', high: 'Haute', medium: 'Moyenne', low: 'Basse',
};

export function TaskCard({ task, onComplete, onDelete, onClick, dragging }: TaskCardProps) {
  const isDone = task.status === 'done';

  return (
    <motion.div
      {...fadeInUp}
      whileHover={{ scale: dragging ? 1 : 1.01 }}
      className={cn(
        'group relative rounded-xl border-l-4 bg-white dark:bg-[#2a2a3e] border border-[#D0D0E8] dark:border-[#45456a] shadow-sm p-4 cursor-pointer transition-all hover:border-[#A0A0C0] hover:shadow-md dark:hover:border-[#45456a] dark:hover:bg-[#30304a] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]',
        priorityBorder(task.priority),
        isDone && 'opacity-60',
        dragging && 'shadow-2xl rotate-1 scale-105'
      )}
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); !isDone && onComplete?.(task._id); }}
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors',
            isDone
              ? 'border-emerald-500 bg-emerald-500'
              : 'border-gray-300 dark:border-[#45456a] hover:border-violet-400'
          )}
        >
          {isDone && <Check size={10} className="text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium text-text-primary leading-snug', isDone && 'line-through text-text-secondary')}>
            {task.title}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={task.priority as TaskPriority}>{PRIORITY_LABEL[task.priority]}</Badge>

            {task.dueDate && (
              <span className={cn('flex items-center gap-1 text-xs', task.isOverdue ? 'text-red-500' : 'text-text-secondary')}>
                <Clock size={11} />
                {formatRelativeDate(task.dueDate)}
              </span>
            )}

            {task.subtaskProgress && task.subtaskProgress.total > 0 && (
              <span className="text-xs text-text-secondary">
                {task.subtaskProgress.done}/{task.subtaskProgress.total}
              </span>
            )}

            {task.tags.map((tag) => (
              <span key={tag._id} className="flex items-center gap-1 text-xs text-text-secondary">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Always visible on touch, hover-only on desktop */}
        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(task._id); }}
            className="p-1.5 text-text-secondary hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
          <ChevronRight size={16} className="text-text-secondary" />
        </div>
      </div>

      {task.subtaskProgress && task.subtaskProgress.total > 0 && (
        <div className="mt-3 h-1 rounded-full bg-gray-200 dark:bg-[#45456a] overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all"
            style={{ width: `${task.subtaskProgress.pct}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}
