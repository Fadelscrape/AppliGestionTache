import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TaskForm } from '@/components/tasks/TaskForm';
import type { Task, TaskStatus } from '@/types';

export default function KanbanPage() {
  const { fetchTasks, completeTask, deleteTask, patchStatus, patchPosition, createTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  useEffect(() => { fetchTasks(); }, []);

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          onComplete={completeTask}
          onDelete={deleteTask}
          onTaskClick={() => {}}
          onAddTask={handleAddTask}
          onStatusChange={patchStatus}
          onPositionChange={patchPosition}
        />
      </div>

      <TaskForm
        open={showForm}
        onClose={() => setShowForm(false)}
        defaultStatus={defaultStatus}
        onSubmit={async (data) => { await createTask(data as Task); }}
      />
    </div>
  );
}
