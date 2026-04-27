import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['inbox', 'todo', 'doing', 'review', 'done']).default('inbox'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedMinutes: z.coerce.number().positive().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  defaultValues?: Partial<Task>;
  defaultStatus?: Task['status'];
}

const selectClass =
  'rounded-lg border border-gray-200 dark:border-white/10 bg-bg-input px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet-500 w-full';

const textareaClass =
  'w-full rounded-lg border border-gray-200 dark:border-white/10 bg-bg-input px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none';

export function TaskForm({ open, onClose, onSubmit, defaultValues, defaultStatus }: TaskFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      priority: defaultValues?.priority ?? 'medium',
      status: defaultValues?.status ?? defaultStatus ?? 'inbox',
      startDate: defaultValues?.startDate?.split('T')[0] ?? '',
      dueDate: defaultValues?.dueDate?.split('T')[0] ?? '',
      estimatedMinutes: defaultValues?.estimatedMinutes ?? '',
    },
  });

  const handleClose = () => { reset(); onClose(); };

  const submit = async (data: FormData) => {
    await onSubmit({
      ...data,
      estimatedMinutes: data.estimatedMinutes ? Number(data.estimatedMinutes) : undefined,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={defaultValues ? 'Modifier la tâche' : 'Nouvelle tâche'} size="md">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input label="Titre" placeholder="Que voulez-vous accomplir ?" error={errors.title?.message} {...register('title')} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Description</label>
          <textarea
            className={textareaClass}
            rows={3}
            placeholder="Détails optionnels..."
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Priorité</label>
            <select className={selectClass} {...register('priority')}>
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Statut</label>
            <select className={selectClass} {...register('status')}>
              <option value="inbox">Boîte de réception</option>
              <option value="todo">À faire</option>
              <option value="doing">En cours</option>
              <option value="review">En révision</option>
              <option value="done">Terminé</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Date de début" type="date" error={errors.startDate?.message} {...register('startDate')} />
          <Input label="Date d'échéance" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
        </div>

        <Input label="Durée estimée (min)" type="number" placeholder="25" error={errors.estimatedMinutes?.message} {...register('estimatedMinutes')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>Annuler</Button>
          <Button type="submit" loading={isSubmitting}>
            {defaultValues ? 'Enregistrer' : 'Créer la tâche'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
