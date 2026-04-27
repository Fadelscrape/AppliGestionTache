import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskCard } from '@/components/tasks/TaskCard';
import type { Task, TaskStatus } from '@/types';

interface SortableCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
}

function SortableCard({ task, onComplete, onDelete, onClick }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onComplete={onComplete} onDelete={onDelete} onClick={onClick} dragging={isDragging} />
    </div>
  );
}

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({ id, title, tasks, color, onComplete, onDelete, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isDone = id === 'done';

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-2xl border min-h-[200px] transition-colors',
        isDone
          ? 'bg-[#EAEAF2] dark:bg-[#1e1e35] border-[#C8C8DC] dark:border-[#45456a]'
          : 'bg-[#F0F0F8] dark:bg-[#252540] border-[#C8C8DC] dark:border-[#45456a]',
        isOver && 'border-violet-400 dark:border-violet-500/50 bg-violet-50 dark:bg-violet-500/10'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#C8C8DC] dark:border-[#45456a]">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold text-text-primary">{title}</span>
          <span className="ml-1 rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-xs text-text-secondary">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(id)}
          className="p-1 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {tasks.map((task) => (
            <SortableCard
              key={task._id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
              onClick={onTaskClick}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-[#B0B0CC] dark:border-[#45456a] dark:bg-[#1e1e35]">
              <p className="text-xs text-text-secondary">Déposer ici</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
