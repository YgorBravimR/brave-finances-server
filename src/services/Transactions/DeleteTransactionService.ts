import { getRepository } from 'typeorm';
import { Transaction } from '../../app/models/Transaction';

interface IRequest {
  user_id: string;
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({ user_id, transaction_id }: IRequest): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const transaction = await transactionsRepository.findOne({ where: { user_id, id: transaction_id } });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transactionsRepository.remove(transaction);
  }
}

export { DeleteTransactionService };
