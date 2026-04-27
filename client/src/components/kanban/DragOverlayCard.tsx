import { TaskCard } from '@/components/tasks/TaskCard';
import type { Task } from '@/types';

export function DragOverlayCard({ task }: { task: Task }) {
  return (
    <div className="rotate-2 shadow-2xl opacity-95">
      <TaskCard task={task} dragging />
    </div>
  );
}
