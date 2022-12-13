import { Router } from 'express';
import { CreateTransactionService } from '../services/CreateNewTransactionService';
import { getCustomRepository } from 'typeorm';
import { TransactionsRepository } from '../repositories/TransactionsRepository';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const transactionsRouter = Router();

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.get('/', async (req, res) => {
  console.log(req.user);
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();

  return res.json(transactions);
});

transactionsRouter.post('/', async (req, res) => {
  const { account, value, description, type, date, user_id } = req.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({ account, date, description, type, value, user_id });

  return res.json(transaction);
});

export { transactionsRouter };
