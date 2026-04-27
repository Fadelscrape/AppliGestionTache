import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';
import { getProjects, createProject, updateProject, archiveProject, getProjectTasks } from '../controllers/project.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', validate(createProjectSchema), createProject);
router.put('/:id', validate(updateProjectSchema), updateProject);
router.delete('/:id', archiveProject);
router.get('/:id/tasks', getProjectTasks);

export default router;
