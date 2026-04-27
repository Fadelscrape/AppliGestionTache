import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const details = result.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
        const path = issue.path.slice(1).join('.') || '_';
        if (!acc[path]) acc[path] = [];
        acc[path].push(issue.message);
        return acc;
      }, {});
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details,
      });
      return;
    }

    const parsed = result.data as Record<string, unknown>;
    req.body = (parsed.body as Record<string, unknown>) ?? req.body;
    next();
  };
}
