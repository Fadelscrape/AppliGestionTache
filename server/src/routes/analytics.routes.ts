import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getSummary, getHeatmap, getWeekly, getPriorities } from '../controllers/analytics.controller';

const router = Router();

router.use(authMiddleware);

router.get('/summary', getSummary);
router.get('/heatmap', getHeatmap);
router.get('/weekly', getWeekly);
router.get('/priorities', getPriorities);

export default router;
