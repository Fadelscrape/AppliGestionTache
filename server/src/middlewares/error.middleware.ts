import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  console.error('[ERREUR SERVEUR]', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    cause: (err as NodeJS.ErrnoException).code,
  });

  res.status(500).json({
    success: false,
    error: 'Erreur serveur interne',
    detail: err.message,
  });
}
