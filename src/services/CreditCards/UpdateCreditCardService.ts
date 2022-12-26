import { getMongoRepository } from 'typeorm';
import { CreditCard } from '../../app/models/schemas/CreditCard';

interface IRequest {
  credit_card_id: string;
  flag?: string;
  account_id?: string;
  close_date?: number;
  due_date?: number;
  description?: string;
  limit?: number;
  enable?: boolean;
}

class UpdateCreditCardService {
  public async execute(CreditCardChanges: IRequest): Promise<void> {
    const CreditCardRepository = getMongoRepository(CreditCard);

    const { credit_card_id } = CreditCardChanges;

    const creditCard = await CreditCardRepository.findOne(credit_card_id);
    if (!creditCard) {
      throw new Error('CreditCard not found');
    }

    await CreditCardRepository.update(
      {
        id: creditCard.id,
      },
      CreditCardChanges,
    );

    return;
  }
}

export { UpdateCreditCardService };
