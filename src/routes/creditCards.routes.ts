import { Router } from 'express';
import CreditCardsController from '../app/controllers/CreditCardsController';
import authMiddleware from '../app/middlewares/authMiddleware';

const creditCardsRouter = Router();

const creditCardsController = new CreditCardsController();

creditCardsRouter.use(authMiddleware);

creditCardsRouter.post('/', creditCardsController.create);
creditCardsRouter.get('/', creditCardsController.list);
creditCardsRouter.put('/', creditCardsController.update);
creditCardsRouter.delete('/', creditCardsController.delete);

export { creditCardsRouter };
