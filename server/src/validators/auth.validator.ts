import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Minimum 3 caractères')
      .max(20, 'Maximum 20 caractères')
      .regex(/^[a-zA-Z0-9_]+$/, 'Lettres, chiffres et _ uniquement'),
    password: z
      .string()
      .min(8, 'Minimum 8 caractères')
      .regex(/[A-Z]/, 'Au moins 1 majuscule')
      .regex(/[a-z]/, 'Au moins 1 minuscule')
      .regex(/[0-9]/, 'Au moins 1 chiffre')
      .regex(/[^A-Za-z0-9]/, 'Au moins 1 caractère spécial'),
    email: z.string().email('Email invalide').optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Nom d\'utilisateur requis'),
    password: z.string().min(1, 'Mot de passe requis'),
    rememberMe: z.boolean().optional(),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
