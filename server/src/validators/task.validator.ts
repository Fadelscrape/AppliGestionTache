import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Titre requis').max(200, 'Maximum 200 caractères'),
    description: z.string().optional(),
    status: z.enum(['inbox', 'todo', 'doing', 'review', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    startDate: z.string().datetime().optional(),
    dueDate: z.string().datetime().optional(),
    dueTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM').optional(),
    estimatedMinutes: z.number().positive().optional(),
    projectId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    position: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    status: z.enum(['inbox', 'todo', 'doing', 'review', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    startDate: z.string().datetime().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    dueTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
    estimatedMinutes: z.number().positive().nullable().optional(),
    actualMinutes: z.number().positive().nullable().optional(),
    projectId: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

export const patchStatusSchema = z.object({
  body: z.object({
    status: z.enum(['inbox', 'todo', 'doing', 'review', 'done']),
  }),
});

export const patchPositionSchema = z.object({
  body: z.object({
    position: z.string().min(1, 'Position requise'),
  }),
});

export const createSubtaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    order: z.number().optional(),
  }),
});

export const updateSubtaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    done: z.boolean().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
