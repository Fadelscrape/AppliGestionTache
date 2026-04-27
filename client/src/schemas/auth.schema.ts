import { z } from 'zod';

export const registerSchema = z
  .object({
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
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
