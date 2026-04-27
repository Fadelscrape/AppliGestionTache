import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Subtask } from '@/types';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle?: (sid: string, done: boolean) => void;
  onAdd?: (title: string) => void;
  onDelete?: (sid: string) => void;
  readOnly?: boolean;
}

export function SubtaskList({ subtasks, onToggle, onAdd, onDelete, readOnly }: SubtaskListProps) {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd?.(newTitle.trim());
    setNewTitle('');
  };

  return (
    <div className="space-y-2">
      {subtasks.map((sub) => (
        <div key={sub._id} className="flex items-center gap-2 group">
          <button
            onClick={() => !readOnly && onToggle?.(sub._id, !sub.done)}
            className={cn(
              'h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors',
              sub.done ? 'border-emerald-500 bg-emerald-500' : 'border-white/20 hover:border-violet-400'
            )}
          >
            {sub.done && <Check size={9} className="text-white" strokeWidth={3} />}
          </button>
          <span className={cn('flex-1 text-sm text-gray-300', sub.done && 'line-through text-gray-600')}>
            {sub.title}
          </span>
          {!readOnly && (
            <button onClick={() => onDelete?.(sub._id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex items-center gap-2 mt-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ajouter une sous-tâche..."
            className="flex-1 bg-transparent text-sm text-gray-400 placeholder-gray-600 outline-none border-b border-white/10 pb-1 focus:border-violet-500 transition-colors"
          />
          <button onClick={handleAdd} className="p-1 text-gray-500 hover:text-violet-400 transition-colors">
            <Plus size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
