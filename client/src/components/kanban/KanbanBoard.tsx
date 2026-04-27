import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { DragOverlayCard } from './DragOverlayCard';
import { useTaskStore } from '@/store/taskStore';
import type { Task, TaskStatus } from '@/types';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo',   title: 'À faire',      color: '#6b7280' },
  { id: 'doing',  title: 'En cours',     color: '#3b82f6' },
  { id: 'review', title: 'En révision',  color: '#f59e0b' },
  { id: 'done',   title: 'Terminé',      color: '#10b981' },
];

interface KanbanBoardProps {
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onPositionChange: (id: string, position: string) => void;
}

export function KanbanBoard({ onComplete, onDelete, onTaskClick, onAddTask, onStatusChange, onPositionChange }: KanbanBoardProps) {
  const { tasks, updateTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const getColumn = useCallback((status: TaskStatus) =>
    tasks.filter((t) => t.status === status && !t.deletedAt).sort((a, b) => a.position.localeCompare(b.position)),
    [tasks]
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t._id === active.id) ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return;
    const task = tasks.find((t) => t._id === active.id);
    if (!task) return;
    const newStatus = over.id as TaskStatus;
    if (COLUMNS.some((c) => c.id === newStatus) && task.status !== newStatus) {
      updateTask(active.id as string, { status: newStatus });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const task = tasks.find((t) => t._id === active.id);
    const overTask = tasks.find((t) => t._id === over.id);
    if (!task) return;

    if (overTask && task.status === overTask.status) {
      const col = getColumn(task.status as TaskStatus);
      const reordered = arrayMove(col, col.findIndex((t) => t._id === active.id), col.findIndex((t) => t._id === over.id));
      reordered.forEach((t, i) => {
        const pos = String(i).padStart(6, '0');
        updateTask(t._id, { position: pos });
        onPositionChange(t._id, pos);
      });
    } else if (COLUMNS.some((c) => c.id === over.id)) {
      onStatusChange(task._id, over.id as TaskStatus);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      {/* Mobile: horizontal scroll  |  md: 2 cols  |  xl: 4 cols */}
      <div className="flex gap-4 h-full overflow-x-auto pb-2 md:grid md:grid-cols-2 xl:grid-cols-4 snap-x snap-mandatory md:snap-none">
        {COLUMNS.map((col) => (
          <div key={col.id} className="min-w-[280px] md:min-w-0 snap-start shrink-0 md:shrink flex flex-col">
            <KanbanColumn
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={getColumn(col.id)}
              onComplete={onComplete}
              onDelete={onDelete}
              onTaskClick={onTaskClick}
              onAddTask={onAddTask}
            />
          </div>
        ))}
      </div>
      <DragOverlay>{activeTask && <DragOverlayCard task={activeTask} />}</DragOverlay>
    </DndContext>
  );
}
