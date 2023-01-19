import { getMongoRepository } from 'typeorm';
import { CreditCard } from '../../app/models/schemas/CreditCard';
import User from '../../app/models/schemas/User';

interface IRequest {
  user_id: string;
  flag: string;
  account_id: string;
  close_date: number;
  due_date: number;
  description: string;
  limit: number;
}

class CreateCreditCardService {
  public async execute({
    flag,
    account_id,
    close_date,
    due_date,
    description,
    user_id,
    limit,
  }: IRequest): Promise<CreditCard> {
    const usersRepository = getMongoRepository(User);
    const checkUserExists = await usersRepository.findOne(user_id);

    if (!checkUserExists) {
      throw new Error('User do not exist');
    }

    const creditCardsRepository = getMongoRepository(CreditCard);

    const checkCreditCardExists = await creditCardsRepository.findOne({
      where: {
        description,
      },
    });

    if (checkCreditCardExists) {
      throw new Error('CreditCard already exists with this description.');
    }

    // Verify if the due date is valid and less than the close date.
    if (close_date <= due_date) {
      throw new Error('Closing date cannot be less than the due date.');
    }

    const creditCard = creditCardsRepository.create({
      flag,
      account_id,
      close_date,
      due_date,
      description,
      user_id,
      limit,
      enable: true,
    });

    await creditCardsRepository.save(creditCard);

    return creditCard;
  }
}

export { CreateCreditCardService };
