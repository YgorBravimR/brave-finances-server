import { Router } from 'express';
import TagsController from '../app/controllers/TagsController';
import authMiddleware from '../app/middlewares/authMiddleware';

const tagsRouter = Router();

const tagsController = new TagsController();

tagsRouter.use(authMiddleware);

tagsRouter.post('/', tagsController.create);
tagsRouter.get('/', tagsController.list);
tagsRouter.put('/', tagsController.update);
tagsRouter.delete('/', tagsController.delete);

export { tagsRouter };
