import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Task } from '../models/Task.model';
import { User } from '../models/User.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { calculateXP, getLevel, updateStreak, checkNewAchievements } from '../services/task.service';

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, priority, projectId, tag, search, page = '1', limit = '20' } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { owner: req.userId, deletedAt: null };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (projectId) filter.project = projectId;
  if (tag) filter.tags = tag;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ position: 1 }).skip(skip).limit(limitNum).populate('tags', 'name color').lean({ virtuals: true }),
    Task.countDocuments(filter),
  ]);

  res.json({ success: true, data: { tasks, total, page: pageNum, pages: Math.ceil(total / limitNum) } });
});

export const getTodayTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await Task.find({
    owner: req.userId,
    deletedAt: null,
    $or: [
      { dueDate: { $gte: today, $lt: tomorrow } },
      { dueDate: { $lt: today }, status: { $ne: 'done' } },
    ],
  }).sort({ priority: -1, position: 1 }).populate('tags', 'name color').lean({ virtuals: true });

  res.json({ success: true, data: { tasks } });
});

export const getTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.userId, deletedAt: null })
    .populate('tags', 'name color')
    .lean({ virtuals: true });
  if (!task) throw ApiError.notFound('Tâche introuvable');
  res.json({ success: true, data: { task } });
});

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { projectId, tags, ...rest } = req.body;
  const task = await Task.create({
    ...rest,
    owner: req.userId,
    project: projectId,
    tags: tags || [],
    position: rest.position || `${Date.now()}`,
    xpReward: calculateXP({ ...rest, subtasks: [], priority: rest.priority || 'medium' } as never),
  });
  res.status(201).json({ success: true, data: { task }, message: 'Tâche créée' });
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { projectId, tags, ...rest } = req.body;
  const update: Record<string, unknown> = { ...rest };
  if (projectId !== undefined) update.project = projectId;
  if (tags !== undefined) update.tags = tags;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId, deletedAt: null },
    update,
    { new: true, runValidators: true }
  ).lean({ virtuals: true });

  if (!task) throw ApiError.notFound('Tâche introuvable');
  res.json({ success: true, data: { task } });
});

export const patchStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId, deletedAt: null },
    { status: req.body.status },
    { new: true }
  ).lean({ virtuals: true });
  if (!task) throw ApiError.notFound('Tâche introuvable');
  res.json({ success: true, data: { task } });
});

export const patchPosition = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId, deletedAt: null },
    { position: req.body.position },
    { new: true }
  ).lean({ virtuals: true });
  if (!task) throw ApiError.notFound('Tâche introuvable');
  res.json({ success: true, data: { task } });
});

export const completeTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.userId, deletedAt: null });
  if (!task) throw ApiError.notFound('Tâche introuvable');

  const xpGained = calculateXP(task);
  task.status = 'done';
  task.completedAt = new Date();
  task.xpReward = xpGained;
  await task.save();

  const user = await User.findById(req.userId);
  if (!user) throw ApiError.notFound('Utilisateur introuvable');

  updateStreak(user);
  user.xp += xpGained;
  user.level = getLevel(user.xp);

  const totalCompleted = await Task.countDocuments({ owner: req.userId, status: 'done', deletedAt: null });
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayCompleted = await Task.countDocuments({ owner: req.userId, status: 'done', completedAt: { $gte: todayStart } });
  const isEarly = task.dueDate && new Date() < task.dueDate;
  const isLate = new Date().getHours() >= 22;

  const newAchievements = checkNewAchievements(user, {
    totalCompleted,
    streakCurrent: user.streakCurrent,
    todayCompleted,
    level: user.level,
    totalPomodoros: 0,
    urgentCompleted: task.priority === 'urgent' ? 1 : 0,
    earlyCompleted: isEarly ? 1 : 0,
    lateTaskCompleted: isLate ? 1 : 0,
  });

  await user.save();

  res.json({
    success: true,
    data: { task: task.toObject({ virtuals: true }), xpGained, newAchievements, user: { xp: user.xp, level: user.level, streakCurrent: user.streakCurrent } },
  });
});

export const softDeleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );
  if (!task) throw ApiError.notFound('Tâche introuvable');
  res.json({ success: true, message: 'Tâche supprimée' });
});

export const hardDeleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!task) throw ApiError.notFound('Tâche introuvable');
  res.json({ success: true, message: 'Tâche supprimée définitivement' });
});

export const addSubtask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId, deletedAt: null },
    { $push: { subtasks: { title: req.body.title, done: false, order: req.body.order ?? 0 } } },
    { new: true }
  ).lean({ virtuals: true });
  if (!task) throw ApiError.notFound('Tâche introuvable');
  res.status(201).json({ success: true, data: { task } });
});

export const updateSubtask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, sid } = req.params;
  const { title, done } = req.body;

  const update: Record<string, unknown> = {};
  if (title !== undefined) update['subtasks.$.title'] = title;
  if (done !== undefined) update['subtasks.$.done'] = done;

  const task = await Task.findOneAndUpdate(
    { _id: id, owner: req.userId, 'subtasks._id': new mongoose.Types.ObjectId(sid as string) },
    { $set: update },
    { new: true }
  ).lean({ virtuals: true });

  if (!task) throw ApiError.notFound('Tâche ou sous-tâche introuvable');
  res.json({ success: true, data: { task } });
});
