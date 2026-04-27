import { User, IUser } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { signAccessToken, signRefreshToken, sha256 } from '../utils/tokens';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function registerUser(data: RegisterInput): Promise<{ tokens: AuthTokens; user: Partial<IUser> }> {
  const existing = await User.findOne({ username: data.username });
  if (existing) throw ApiError.conflict('Ce nom d\'utilisateur est déjà pris');

  const user = await User.create({
    username: data.username,
    password: data.password,
    email: data.email,
  });

  const tokens = await issueTokens(user);
  return { tokens, user: sanitizeUser(user) };
}

export async function loginUser(data: LoginInput): Promise<{ tokens: AuthTokens; user: Partial<IUser> }> {
  const user = await User.findOne({ username: data.username }).select('+password');
  if (!user) throw ApiError.unauthorized('Identifiants invalides');

  const valid = await user.comparePassword(data.password);
  if (!valid) throw ApiError.unauthorized('Identifiants invalides');

  const tokens = await issueTokens(user, data.rememberMe);
  return { tokens, user: sanitizeUser(user) };
}

export async function refreshTokens(rawRefreshToken: string): Promise<{ tokens: AuthTokens; user: Partial<IUser> }> {
  const { verifyRefreshToken } = await import('../utils/tokens');
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw ApiError.unauthorized('Refresh token invalide');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash');
  if (!user) throw ApiError.unauthorized('Utilisateur introuvable');

  const incoming = sha256(rawRefreshToken);
  if (user.refreshTokenHash !== incoming) {
    // Potential reuse — revoke session
    user.refreshTokenHash = undefined;
    await user.save();
    throw ApiError.unauthorized('Session révoquée — reconnectez-vous');
  }

  const tokens = await issueTokens(user);
  return { tokens, user: sanitizeUser(user) };
}

export async function logoutUser(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
}

async function issueTokens(user: IUser, rememberMe?: boolean): Promise<AuthTokens> {
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  const hash = sha256(refreshToken);

  await User.findByIdAndUpdate(user._id, { refreshTokenHash: hash });

  return { accessToken, refreshToken };
}

export function sanitizeUser(user: IUser): Partial<IUser> {
  const obj = user.toObject();
  delete (obj as Record<string, unknown>).password;
  delete (obj as Record<string, unknown>).refreshTokenHash;
  return obj;
}
