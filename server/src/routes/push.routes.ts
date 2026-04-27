import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { subscribeUser, unsubscribeUser } from '../services/push.service';

const router = Router();

router.use(authMiddleware);

router.post(
  '/subscribe',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { endpoint, keys, expirationTime } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      res.status(400).json({ success: false, error: 'Subscription invalide' });
      return;
    }
    await subscribeUser(req.userId!, { endpoint, keys, expirationTime }, req.headers['user-agent']);
    res.status(201).json({ success: true, message: 'Abonnement enregistré' });
  })
);

router.delete(
  '/unsubscribe',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { endpoint } = req.body;
    if (!endpoint) {
      res.status(400).json({ success: false, error: 'Endpoint requis' });
      return;
    }
    await unsubscribeUser(req.userId!, endpoint);
    res.json({ success: true, message: 'Abonnement supprimé' });
  })
);

export default router;
