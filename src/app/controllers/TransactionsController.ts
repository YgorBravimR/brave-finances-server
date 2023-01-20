import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import * as Yup from 'yup';
import AppError from '../../errors/AppError';
import ResponseSuccess from '../../libs/responseSuccess';

import { CreateTransactionService } from '../../services/Transactions/CreateTransactionService';
import { DeleteTransactionService } from '../../services/Transactions/DeleteTransactionService';
import { UpdateTransactionService } from '../../services/Transactions/UpdateTransactionService';

export default class TransactionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const transactionsTypeAvailable = ['income', 'expense', 'credit_card', 'transfer'];

      const schema = Yup.object().shape({
        value: Yup.number().moreThan(0).required(),
        description: Yup.string(),
        type: Yup.string().required().oneOf(transactionsTypeAvailable),
        date: Yup.date().required(),
        paid: Yup.boolean().required(),
        category_id: Yup.string().required(),
        account_id: Yup.string().required(),
        tags: Yup.string(),
        fixed: Yup.boolean().required(),
        repeat: Yup.boolean().required(),
        repeated_times: Yup.number().when('repeat', {
          is: true,
          then: Yup.number().required(),
        }),
        time_period: Yup.string().when('repeat', {
          is: true,
          then: Yup.string().required(),
        }),
        currency: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        throw new AppError('Error on validate mandatory informations', '400');
      }

      const createTransaction = new CreateTransactionService();
      const transaction = await createTransaction.execute({
        ...req.body,
        user_id,
      });

      return res.json(new ResponseSuccess({ transaction }));
    } catch (error) {
      return res.json(new AppError('Failed when trying to create an account.', (error as Error).message));
    }
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
