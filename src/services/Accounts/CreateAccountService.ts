import { getMongoRepository } from 'typeorm';
import { Account } from '../../app/models/schemas/Account';
import User from '../../app/models/schemas/User';

interface IRequest {
  account_name: string;
  description: string;
  type: string;
  bank: string;
  user_id: string;
  color: string;
  simulated_yield: number;
  yield_model: string;
  initial_price: string;
}

class CreateAccountService {
  public async execute({
    account_name,
    description,
    color,
    simulated_yield,
    type,
    yield_model,
    bank,
    user_id,
    initial_price,
  }: IRequest): Promise<Account> {
    const usersRepository = getMongoRepository(User);
    const checkUserExists = await usersRepository.findOne(user_id);

    if (!checkUserExists) {
      throw new Error('User do not exist');
    }

    const accountsRepository = getMongoRepository(Account);

    const checkAccountExists = await accountsRepository.findOne({
      where: {
        account_name,
        user_id,
      },
    });

    if (checkAccountExists) {
      throw new Error('Account already exists with this name');
    }

    const account = accountsRepository.create({
      account_name,
      description,
      type,
      bank,
      user_id,
      color,
      simulated_yield,
      yield_model,
      initial_price,
    });

    await accountsRepository.save(account);

    return account;
  }
}

export { CreateAccountService };
