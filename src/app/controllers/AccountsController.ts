import { Request, Response } from 'express';

import * as Yup from 'yup';
import AppError from '../../errors/AppError';

import { CreateAccountService } from '../../services/Accounts/CreateAccountService';
import { UpdateAccountService } from '../../services/Accounts/UpdateAccountService';
import ResponseSuccess from '../../libs/responseSuccess';
import { getMongoRepository } from 'typeorm';
import { Account } from '../models/schemas/Account';

export default class AccountsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { initial_price, account_name, description, color, simulated_yield, type, yield_model, bank } = req.body;
      const user_id = req.user.id;

      const avaiableBanks = ['nubank', 'inter', 'itau', 'santander', 'bradesco', 'other', 'xp'];

      const schema = Yup.object().shape({
        initial_price: Yup.string().required(),
        account_name: Yup.string().required(),
        description: Yup.string().required(),
        type: Yup.string().required(),
        color: Yup.string(),
        simulated_yield: Yup.number(),
        yield_model: Yup.string(),
        bank: Yup.string().required().oneOf(avaiableBanks),
      });

      if (
        !(await schema.isValid({
          initial_price,
          account_name,
          description,
          color,
          simulated_yield,
          type,
          yield_model,
          bank,
        }))
      ) {
        throw new Error('Error on validate mandatory information');
      }

      const createAccount = new CreateAccountService();

      const account = await createAccount.execute({
        account_name,
        description,
        color,
        simulated_yield,
        type,
        yield_model,
        bank,
        user_id,
        initial_price,
      });
      return res.json(new ResponseSuccess({ account }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to create an account.', (error as Error).message));
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const accountRepository = getMongoRepository(Account);
      const accounts = await accountRepository.find({
        where: { user_id },
      });

      return res.json(new ResponseSuccess({ accounts }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to list an account.', (error as Error).message));
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const avaiableBanks = ['nubank', 'inter', 'itau', 'santander', 'bradesco', 'other'];
      const schema = Yup.object().shape({
        account_id: Yup.string().required(),
        account_name: Yup.string(),
        bank: Yup.string().oneOf(avaiableBanks),
        description: Yup.string(),
        type: Yup.string(),
        color: Yup.string(),
        simulated_yield: Yup.number(),
        yield_model: Yup.string(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new Error('Error on validate mandatory informations');
      }

      const updateAccountService = new UpdateAccountService();

      await updateAccountService.execute({
        ...req.body,
        user_id,
      });

      return res.json(new ResponseSuccess({ message: 'Account updated successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to update an account.', (error as Error).message));
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { account_id } = req.body;

      const accountsRepository = getMongoRepository(Account);

      const account = await accountsRepository.findOne(account_id);

      if (!account) {
        throw new Error('Do not possibly delete');
      }

      await accountsRepository.remove(account);

      return res.json(new ResponseSuccess({ message: 'Account deleted successfully' }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to delete an account.', (error as Error).message));
    }
  }
}
