import { Router } from 'express';
import { CreateTransactionService } from '../services/CreateTransactionService';
import { getCustomRepository } from 'typeorm';
import { TransactionsRepository } from '../app/repositories/TransactionsRepository';
import ensureAuthenticated from '../app/middlewares/ensureAuthenticated';

const transactionsRouter = Router();

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.get('/', async (req, res) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();

  return res.json(transactions);
});

transactionsRouter.post('/', async (req, res) => {
  const { account_id, value, description, type, date, user_id } = req.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({ account_id, date, description, type, value, user_id });

  return res.json(transaction);
});

export { transactionsRouter };
