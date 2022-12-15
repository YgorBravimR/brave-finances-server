import { Transaction } from '../../app/models/Transaction';
import { getRepository } from 'typeorm';

interface IRequest {
  account_id: string;
  value: number;
  description: string;
  type: string;
  date: Date;
  user_id: string;
}

class CreateTransactionService {
  public async execute({ account_id, date, description, type, value, user_id }: IRequest): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);

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
