import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Task } from '../models/Task.model';
import { User } from '../models/User.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) throw ApiError.notFound('Utilisateur introuvable');

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7); weekStart.setHours(0, 0, 0, 0);

  const [todayCompleted, todayTotal, weekCompleted] = await Promise.all([
    Task.countDocuments({ owner: req.userId, status: 'done', completedAt: { $gte: todayStart, $lte: todayEnd } }),
    Task.countDocuments({ owner: req.userId, deletedAt: null, dueDate: { $gte: todayStart, $lte: todayEnd } }),
    Task.countDocuments({ owner: req.userId, status: 'done', completedAt: { $gte: weekStart } }),
  ]);

  res.json({
    success: true,
    data: {
      todayCompleted,
      todayTotal,
      weekCompleted,
      streakCurrent: user.streakCurrent,
      totalXP: user.xp,
      level: user.level,
    },
  });
});

export const getHeatmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  const yearAgo = new Date(); yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const tasks = await Task.aggregate([
    {
      $match: {
        owner: req.userId,
        status: 'done',
        completedAt: { $gte: yearAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const heatmap = tasks.map((t) => ({ date: t._id as string, count: t.count as number }));
  res.json({ success: true, data: { heatmap } });
});

export const getWeekly = asyncHandler(async (req: AuthRequest, res: Response) => {
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0, 0, 0, 0);

  const tasks = await Task.aggregate([
    {
      $match: {
        owner: req.userId,
        status: 'done',
        completedAt: { $gte: weekStart },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data: { weekly: tasks.map((t) => ({ date: t._id as string, count: t.count as number })) } });
});

export const getPriorities = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await Task.aggregate([
    { $match: { owner: req.userId, status: 'done', deletedAt: null } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  res.json({ success: true, data: { priorities: result.map((r) => ({ priority: r._id as string, count: r.count as number })) } });
});
