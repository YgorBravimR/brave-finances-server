import { Transaction } from '../models/Transaction';
import { TransactionsRepository } from '../repositories/TransactionsRepository';

import { getCustomRepository } from 'typeorm';

interface Request {
  account: string;
  value: number;
  description: string;
  type: 'income' | 'expense';
  date: Date;
  user_id: string;
}

class CreateTransactionService {
  public async execute({ account, date, description, type, value, user_id }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = transactionsRepository.create({ account, value, description, type, date, user_id });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export { CreateTransactionService };
