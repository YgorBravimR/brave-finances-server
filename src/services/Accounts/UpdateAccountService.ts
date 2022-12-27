import { getMongoRepository } from 'typeorm';
import { Account } from '../../app/models/schemas/Account';

interface IRequest {
  account_name?: string;
  description?: string;
  type?: string;
  bank?: string;
  user_id: string;
  color?: string;
  simulated_yield?: number;
  yield_model?: string;
  account_id: string;
}

class UpdateAccountService {
  public async execute(accountChanges: IRequest): Promise<void> {
    const accountsRepository = getMongoRepository(Account);

    const { account_id } = accountChanges;

    const account = await accountsRepository.findOne(account_id);
    if (!account) {
      throw new Error('Account not found');
    }

    await accountsRepository.update(
      {
        id: account.id,
      },
      accountChanges,
    );

    return;
  }
}

export { UpdateAccountService };
