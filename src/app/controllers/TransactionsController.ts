import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import * as Yup from 'yup';
import AppError from '../../errors/AppError';

import { CreateTransactionService } from '../../services/Transactions/CreateTransactionService';
import { DeleteTransactionService } from '../../services/Transactions/DeleteTransactionService';
import { UpdateTransactionService } from '../../services/Transactions/UpdateTransactionService';

import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';

export default class TransactionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { account_id, value, description, type, date } = req.body;

    const user_id = req.user.id;

    const transactionsTypeAvaiable = ['income', 'expense'];

    const schema = Yup.object().shape({
      value: Yup.number().required(),
      description: Yup.string().required(),
      type: Yup.string().required().oneOf(transactionsTypeAvaiable),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid({ value, description, type, date }))) {
      throw new AppError('Error on validate mandatory informations', '400');
    }

    const accountsRepository = getRepository(Account);

    const userExist = await accountsRepository.findOne({ where: { user_id, id: account_id } });

    if (!userExist) {
      throw new AppError('User not found', '404');
    }

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({ account_id, user_id, value, description, type, date });

    return res.json(transaction);
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const listTransactions = getRepository(Transaction);

    try {
      const transactions = await listTransactions.find({ user_id });

      return res.json(transactions);
    } catch {
      return res.json(new AppError('User not found', '404'));
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { transaction_id, value, description, type, date } = req.body;

    const user_id = req.user.id;

    const transactionsTypeAvaiable = ['income', 'expense'];

    const schema = Yup.object().shape({
      value: Yup.number().required(),
      description: Yup.string().required(),
      type: Yup.string().required().oneOf(transactionsTypeAvaiable),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid({ value, description, type, date }))) {
      throw new AppError('Error on validate mandatory informations', '400');
    }

    const updateTransactionService = new UpdateTransactionService();

    const transaction = await updateTransactionService.execute({
      user_id,
      transaction_id,
      value,
      description,
      type,
      date,
    });

    return res.json(transaction);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { transaction_id } = req.body;

      const user_id = req.user.id;

      new DeleteTransactionService().execute({
        user_id,
        transaction_id,
      });
      return res.json({ success: `User com id: ${user_id} -> deleted succesfully` });
    } catch {
      return res.json({ error: 'Error on deletion of account' });
    }
  }
}
