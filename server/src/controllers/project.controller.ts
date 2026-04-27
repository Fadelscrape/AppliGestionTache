import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Project } from '../models/Project.model';
import { Task } from '../models/Task.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projects = await Project.find({ owner: req.userId, status: { $ne: 'archived' } }).sort({ createdAt: -1 });
  res.json({ success: true, data: { projects } });
});

export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.create({ ...req.body, owner: req.userId });
  res.status(201).json({ success: true, data: { project }, message: 'Projet créé' });
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!project) throw ApiError.notFound('Projet introuvable');
  res.json({ success: true, data: { project } });
});

export const archiveProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    { status: 'archived' },
    { new: true }
  );
  if (!project) throw ApiError.notFound('Projet introuvable');
  res.json({ success: true, message: 'Projet archivé' });
});

export const getProjectTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
  if (!project) throw ApiError.notFound('Projet introuvable');

  const tasks = await Task.find({ project: req.params.id, owner: req.userId, deletedAt: null })
    .sort({ position: 1 })
    .populate('tags', 'name color')
    .lean({ virtuals: true });

  res.json({ success: true, data: { tasks } });
});
