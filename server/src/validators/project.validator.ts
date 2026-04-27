import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nom requis').max(100, 'Maximum 100 caractères'),
    emoji: z.string().default('📁'),
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, 'Couleur hex invalide')
      .default('#7c3aed'),
    description: z.string().optional(),
    deadline: z.string().datetime().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    emoji: z.string().optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    description: z.string().optional(),
    deadline: z.string().datetime().nullable().optional(),
    status: z.enum(['active', 'on-hold', 'completed', 'archived']).optional(),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
