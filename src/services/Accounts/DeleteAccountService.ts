import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import { Account } from '../../app/models/Account';
import { User } from '../../app/models/User';

interface IRequest {
  user_id: string;
  account_id: string;
  password: string;
}

class DeleteAccountService {
  public async execute({ user_id, account_id, password }: IRequest): Promise<void> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new Error('Password is incorrect');
    }

    const accountsRepository = getRepository(Account);

    const account = await accountsRepository.findOne({ where: { user_id, id: account_id } });

    if (!account) {
      throw new Error('Account not found');
    }

    accountsRepository.remove(account);
  }
}

export { DeleteAccountService };
