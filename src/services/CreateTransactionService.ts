import { Transaction } from '../app/models/Transaction';
import { TransactionsRepository } from '../app/repositories/TransactionsRepository';

import { getCustomRepository } from 'typeorm';

interface IRequest {
  account_id: string;
  value: number;
  description: string;
  type: 'income' | 'expense';
  date: Date;
  user_id: string;
}

class CreateTransactionService {
  public async execute({ account_id, date, description, type, value, user_id }: IRequest): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = transactionsRepository.create({
      account_id,
      value,
      description,
      type,
      date,
      user_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export { CreateTransactionService };
