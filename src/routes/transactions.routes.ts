import { Router } from 'express';
import authMiddleware from '../app/middlewares/authMiddleware';
import TransactionsController from '../app/controllers/TransactionsController';

const transactionsRouter = Router();

const transactionsController = new TransactionsController();

transactionsRouter.use(authMiddleware);

transactionsRouter.post('/', transactionsController.create);
transactionsRouter.get('/', transactionsController.list);
transactionsRouter.put('/', transactionsController.update);
transactionsRouter.delete('/', transactionsController.delete);

export { transactionsRouter };
