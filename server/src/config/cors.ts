import { CorsOptions } from 'cors';
import { env } from './env';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  env.CLIENT_URL,
].filter(Boolean) as string[];

const VERCEL_PREVIEW = /^https:\/\/appli-gestion-tache-[a-z0-9-]+-.*\.vercel\.app$/;

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || VERCEL_PREVIEW.test(origin)) return cb(null, true);
    cb(new Error(`CORS bloqué pour l'origine: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};
