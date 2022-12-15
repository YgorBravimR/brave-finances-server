import { Account } from '../../app/models/Account';
import { getRepository } from 'typeorm';

interface IRequest {
  account_name: string;
  description: string;
  type: string;
  bank: string;
  user_id: string;
}

class CreateAccountService {
  public async execute({ account_name, description, type, bank, user_id }: IRequest): Promise<Account> {
    const accountsRepository = getRepository(Account);

    const account = accountsRepository.create({
      account_name,
      description,
      type,
      bank,
      user_id,
    });

    await accountsRepository.save(account);

    return account;
  }
}

export { CreateAccountService };
