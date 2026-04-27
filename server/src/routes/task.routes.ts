import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  patchStatusSchema,
  patchPositionSchema,
  createSubtaskSchema,
  updateSubtaskSchema,
} from '../validators/task.validator';
import {
  getTasks,
  getTodayTasks,
  getTask,
  createTask,
  updateTask,
  patchStatus,
  patchPosition,
  completeTask,
  softDeleteTask,
  hardDeleteTask,
  addSubtask,
  updateSubtask,
} from '../controllers/task.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.get('/today', getTodayTasks);
router.get('/:id', getTask);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.patch('/:id/status', validate(patchStatusSchema), patchStatus);
router.patch('/:id/position', validate(patchPositionSchema), patchPosition);
router.patch('/:id/complete', completeTask);
router.delete('/:id', softDeleteTask);
router.delete('/:id/hard', hardDeleteTask);
router.post('/:id/subtasks', validate(createSubtaskSchema), addSubtask);
router.patch('/:id/subtasks/:sid', validate(updateSubtaskSchema), updateSubtask);

export default router;
