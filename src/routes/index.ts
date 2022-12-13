import { Router } from 'express';

import { accountsRouter } from './accounts.routes';
import { sessionsRouter } from './sessions.routes';
import { transactionsRouter } from './transactions.routes';
import { usersRouter } from './users.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/accounts', accountsRouter);
routes.use('/users', usersRouter);

export { routes };
