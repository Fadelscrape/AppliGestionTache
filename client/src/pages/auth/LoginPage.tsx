import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { fadeInUp } from '@/lib/variants';

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post('/api/auth/login', data);
      const { accessToken, user } = res.data.data;
      login(user, accessToken);
      toast.success(`Bienvenue, ${user.username} !`);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg ?? 'Identifiants invalides');
    }
  };

  return (
    <AuthLayout>
      <motion.div {...fadeInUp} className="rounded-2xl bg-bg-card border border-gray-200 dark:border-[#3A3A55] p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Connexion</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nom d'utilisateur"
            placeholder="monpseudo"
            error={errors.username?.message}
            {...register('username')}
          />
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
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" className="rounded border-white/20 bg-white/5 text-violet-600" {...register('rememberMe')} />
            Se souvenir de moi
          </label>
          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            <LogIn size={16} /> Se connecter
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
