import { getRepository } from 'typeorm';
import { Account } from '../../app/models/Account';

interface IRequest {
  user_id: string;
  account_id: string;
  account_name: string;
  bank: string;
  description: string;
  type: string;
}

class UpdateAccountService {
  public async execute({ user_id, account_id, account_name, bank, description, type }: IRequest): Promise<Account> {
    const accountsRepository = getRepository(Account);

    const account = await accountsRepository.findOne({ where: { user_id, id: account_id } });

    if (!account) {
      throw new Error('Account not found');
    }

    const updatedAccount = { ...account, account_name, bank, description, type };

    await accountsRepository.save(updatedAccount);

    return updatedAccount;
  }
}

export { UpdateAccountService };
