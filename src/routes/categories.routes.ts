import { Router } from 'express';
import CategoriesController from '../app/controllers/CategoriesController';
import authMiddleware from '../app/middlewares/authMiddleware';

const categoriesRouter = Router();

const categoriesController = new CategoriesController();

categoriesRouter.use(authMiddleware);

categoriesRouter.post('/', categoriesController.create);
categoriesRouter.get('/', categoriesController.list);
categoriesRouter.put('/', categoriesController.update);
categoriesRouter.delete('/', categoriesController.delete);

export { categoriesRouter };
