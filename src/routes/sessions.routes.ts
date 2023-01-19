import { Router } from 'express';
import SessionsController from '../app/controllers/SessionsController';

const sessionsController = new SessionsController();

const sessionsRouter = Router();

sessionsRouter.post('/', sessionsController.create);

export { sessionsRouter };
