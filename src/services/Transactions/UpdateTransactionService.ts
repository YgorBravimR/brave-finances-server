import { getRepository } from 'typeorm';
import { Transaction } from '../../app/models/schemas/Transaction';

interface IRequest {
  user_id: string;
  transaction_id: string;
  value: number;
  description: string;
  type: string;
  date: Date;
}

class UpdateTransactionService {
  public async execute({ user_id, transaction_id, value, description, type, date }: IRequest): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);

    const transaction = await transactionsRepository.findOne({ where: { user_id, id: transaction_id } });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const updatedTransaction = { ...transaction, value, description, type, date };

    await transactionsRepository.save(updatedTransaction);

    return updatedTransaction;
  }
}

export { UpdateTransactionService };
