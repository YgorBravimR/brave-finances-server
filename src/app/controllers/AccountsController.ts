import { Request, Response } from 'express';

import * as Yup from 'yup';
import { AppError } from '../../errors/AppError';
import { getRepository } from 'typeorm';
import { Account } from '../models/Account';

import { CreateAccountService } from '../../services/Accounts/CreateAccountService';
import { UpdateAccountService } from '../../services/Accounts/UpdateAccountService';
import { DeleteAccountService } from '../../services/Accounts/DeleteAccountService';

export default class AccountsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { user_id, account_name, description, type, bank } = req.body;

    const avaiableBanks = ['nubank', 'inter', 'itau', 'santander', 'bradesco', 'other'];

    const schema = Yup.object().shape({
      account_name: Yup.string().required(),
      description: Yup.string().required(),
      type: Yup.string().required(),
      bank: Yup.string().required().oneOf(avaiableBanks),
    });

    if (!(await schema.isValid({ account_name, description, type, bank }))) {
      throw new AppError('Error on validate mandatory informations', 400);
    }

    const createAccount = new CreateAccountService();

    const account = await createAccount.execute({ user_id, account_name, description, type, bank });

    return res.json(account);
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.body;

    const listAccount = getRepository(Account);

    try {
      const accounts = await listAccount.find({ user_id });

      return res.json(accounts);
    } catch {
      return res.json(new AppError('User not found', 404));
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { user_id, account_id, account_name, bank, description, type } = req.body;

    const avaiableBanks = ['nubank', 'inter', 'itau', 'santander', 'bradesco', 'other'];

    const schema = Yup.object().shape({
      account_name: Yup.string(),
      bank: Yup.string().oneOf(avaiableBanks),
      description: Yup.string(),
      type: Yup.string(),
    });

    if (!(await schema.isValid({ account_name, bank, description, type }))) {
      throw new AppError('Error on validate mandatory informations', 400);
    }

    const updateAccountService = new UpdateAccountService();

    const updatedAccount = await updateAccountService.execute({
      user_id,
      account_id,
      account_name,
      bank,
      description,
      type,
    });

    return res.json(updatedAccount);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { password, user_id, account_id } = req.body;

      new DeleteAccountService().execute({
        user_id,
        password,
        account_id,
      });
      return res.json({ success: `User com id: ${user_id} -> deleted succesfully` });
    } catch {
      return res.json({ error: 'Error on deletion of account' });
    }
  }
}
