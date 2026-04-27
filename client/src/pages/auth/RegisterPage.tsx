import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { fadeInUp } from '@/lib/variants';

function PasswordStrength({ password }: { password: string }) {
  const checks = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  const passed = checks.filter((r) => r.test(password ?? '')).length + (password?.length >= 8 ? 1 : 0);
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];
  const labels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Excellent'];

  if (!password) return null;
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passed ? colors[passed] : 'bg-white/10'}`} />
        ))}
      </div>
      <p className="text-xs text-gray-400">{labels[passed] ?? ''}</p>
    </div>
  );
}

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const { register, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password') ?? '';

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post('/api/auth/register', {
        username: data.username,
        password: data.password,
      });
      const { accessToken, user } = res.data.data;
      login(user, accessToken);
      toast.success('Compte créé !');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg ?? 'Erreur lors de la création du compte');
    }
  };

  return (
    <AuthLayout>
      <motion.div {...fadeInUp} className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Créer un compte</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nom d'utilisateur"
            placeholder="monpseudo"
            error={errors.username?.message}
            {...register('username')}
          />
          <div className="space-y-2">
            <Input
              label="Mot de passe"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              rightIcon={
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="hover:text-white">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />
            <PasswordStrength password={password} />
          </div>
          <Input
            label="Confirmer le mot de passe"
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            <UserPlus size={16} /> Créer mon compte
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
