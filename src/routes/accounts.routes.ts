import { Router } from 'express';
import AccountsController from '../app/controllers/AccountsController';
// import authMiddleware from '../app/middlewares/authMiddleware';

const accountsRouter = Router();

const accountsController = new AccountsController();

// accountsRouter.use(authMiddleware);

accountsRouter.post('/', accountsController.create);
accountsRouter.get('/', accountsController.list);
accountsRouter.put('/', accountsController.update);
accountsRouter.delete('/', accountsController.delete);

export { accountsRouter };
