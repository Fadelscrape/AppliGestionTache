import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User.model';
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  sanitizeUser,
} from '../services/auth.service';
import { env } from '../config/env';

const COOKIE_NAME = 'refreshToken';

function setCookieOptions(rememberMe = false) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/api/auth',
    maxAge: rememberMe ? 30 * 24 * 3600 * 1000 : 7 * 24 * 3600 * 1000,
  };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { tokens, user } = await registerUser(req.body);
  res.cookie(COOKIE_NAME, tokens.refreshToken, setCookieOptions());
  res.status(201).json({ success: true, data: { accessToken: tokens.accessToken, user } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { tokens, user } = await loginUser(req.body);
  res.cookie(COOKIE_NAME, tokens.refreshToken, setCookieOptions(req.body.rememberMe));
  res.status(200).json({ success: true, data: { accessToken: tokens.accessToken, user } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ success: false, error: 'Refresh token manquant' });
    return;
  }
  const { tokens, user } = await refreshTokens(token);
  res.cookie(COOKIE_NAME, tokens.refreshToken, setCookieOptions());
  res.status(200).json({ success: true, data: { accessToken: tokens.accessToken, user } });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.userId) await logoutUser(req.userId);
  res.clearCookie(COOKIE_NAME, { path: '/api/auth' });
  res.status(200).json({ success: true, message: 'Déconnecté avec succès' });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404).json({ success: false, error: 'Utilisateur introuvable' });
    return;
  }
  res.status(200).json({ success: true, data: { user: sanitizeUser(user) } });
});
