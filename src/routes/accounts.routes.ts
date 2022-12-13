import { Router } from 'express';
import { CreateAccountService } from '../services/CreateAccountService';

const accountsRouter = Router();

accountsRouter.post('/', async (req, res) => {
  const { user_id, account_name, description, type, bank } = req.body;

  const createAccount = new CreateAccountService();

  const account = await createAccount.execute({ user_id, account_name, description, type, bank });

  return res.json(account);
});

export { accountsRouter };
