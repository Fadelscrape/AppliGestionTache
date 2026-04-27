import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import { Tag } from '../models/Tag.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tags = await Tag.find({ owner: req.userId }).sort({ name: 1 });
    res.json({ success: true, data: { tags } });
  })
);

router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, color } = req.body;
    if (!name) {
      res.status(400).json({ success: false, error: 'Nom requis' });
      return;
    }
    const tag = await Tag.create({ owner: req.userId, name, color });
    res.status(201).json({ success: true, data: { tag } });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tag = await Tag.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!tag) throw ApiError.notFound('Tag introuvable');
    res.json({ success: true, message: 'Tag supprimé' });
  })
);

export default router;
