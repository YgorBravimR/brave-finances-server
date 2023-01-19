import { Router } from 'express';

import { accountsRouter } from './accounts.routes';
import { sessionsRouter } from './sessions.routes';
import { transactionsRouter } from './transactions.routes';
import { usersRouter } from './users.routes';
import { categoriesRouter } from './categories.routes';
import { tagsRouter } from './tags.routes';
import { creditCardsRouter } from './creditCards.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/accounts', accountsRouter);
routes.use('/users', usersRouter);
routes.use('/categories', categoriesRouter);
routes.use('/tags', tagsRouter);
routes.use('/creditCards', creditCardsRouter);

export { routes };
