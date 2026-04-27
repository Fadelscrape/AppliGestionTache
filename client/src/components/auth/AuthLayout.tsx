import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { fadeInUp } from '@/lib/variants';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div {...fadeInUp} className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TaskMaster Pro</h1>
          <p className="text-gray-400 mt-1">Gérez vos tâches, gagnez de l'XP</p>
        </motion.div>
        {children}
      </div>
    </div>
  );
}
