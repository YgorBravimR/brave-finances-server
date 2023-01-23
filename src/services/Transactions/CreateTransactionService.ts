import { Transaction } from '../../app/models/schemas/Transaction';
import { Account } from '../../app/models/schemas/Account';
import { Tag } from '../../app/models/schemas/Tag';
import { Category } from '../../app/models/schemas/Category';
import { getMongoRepository } from 'typeorm';
import User from '../../app/models/schemas/User';
import { addDays, addMonths, addWeeks, addYears, format, isValid, parse } from 'date-fns';
import { CreditCard } from '../../app/models/schemas/CreditCard';

interface IRequest {
  user_id: string;
  value: number;
  paid: boolean;
  date: string;
  description?: string;
  category_id: string;
  type: string;
  account_id: string;
  tag_id?: string;
  fixed: boolean;
  repeat: boolean;
  repeated_times?: number;
  time_period?: string;
  credit_card_id?: string;
  transfer_destiny?: string;
  currency: string;
}

interface ITransaction {
  user_id: string;
  value: number;
  paid: boolean;
  date: string;
  description: string;
  category_id: string;
  type: string;
  account_id: string;
  tag_id: string;
  fixed: boolean;
  repeat: boolean;
  repeated_times: number;
  time_period: string;
  credit_card_id: string;
  transfer_destiny: string;
  currency: string;
  installment: string;
}
class CreateTransactionService {
  public async execute({
    value,
    paid,
    date,
    description,
    category_id,
    type,
    account_id,
    tag_id,
    fixed,
    repeat,
    repeated_times,
    time_period,
    currency,
    user_id,
    credit_card_id,
    transfer_destiny,
  }: IRequest): Promise<ITransaction[]> {
    const usersRepository = getMongoRepository(User);

    const checkUserExists = await usersRepository.findOne(user_id);
    if (!checkUserExists) {
      throw new Error('User do not exist');
    }

    let parsedDate = parse(date, 'yyyy-MM-dd', new Date());

    if (!isValid(parsedDate)) {
      throw new Error('Date is not valid');
    }

    const accountsRepository = getMongoRepository(Account);

    const checkAccountExists = await accountsRepository.findOne(account_id);
    if (!checkAccountExists) {
      throw new Error('Account do not exist.');
    }

    if (checkAccountExists.user_id !== user_id) {
      throw new Error('Account do not belongs to this user');
    }

    if (type === 'transfer') {
      const checkAccountExistsTransfer = await accountsRepository.findOne(transfer_destiny);
      if (!checkAccountExistsTransfer) {
        throw new Error('Destination account do not exist.');
      }

      if (checkAccountExistsTransfer.user_id !== user_id) {
        throw new Error('Destination account do not belongs to this user');
      }
    }

    const categoryRepository = getMongoRepository(Category);

    const checkCategoryExists = await categoryRepository.findOne(category_id);
    if (!checkCategoryExists) {
      throw new Error('Category do not exist.');
    }

    if (checkCategoryExists.user_id !== user_id) {
      throw new Error('Category do not belongs to this user');
    }

    const tagRepository = getMongoRepository(Tag);

    const checkTagExists = await tagRepository.findOne(tag_id);
    if (!checkTagExists) {
      throw new Error('Tag do not exist.');
    }

    if (checkTagExists.user_id !== user_id) {
      throw new Error('Tag do not belongs to this user');
    }

    if (type === 'credit_card') {
      const creditCardRepository = getMongoRepository(CreditCard);

      const checkCreditCardExists = await creditCardRepository.findOne(credit_card_id);
      if (!checkCreditCardExists) {
        throw new Error('Credit Card do not exist.');
      }

      if (checkCreditCardExists.user_id !== user_id) {
        throw new Error('Credit Card do not belongs to this user');
      }
    }

    const transactionsRepository = getMongoRepository(Transaction);
    const firstTransaction: ITransaction = {
      value,
      paid,
      date,
      description: description ? description : '',
      category_id,
      type,
      account_id,
      tag_id: tag_id ? tag_id : '',
      fixed,
      repeat,
      repeated_times: repeated_times ? repeated_times : 0,
      time_period: time_period ? time_period : '',
      currency,
      user_id,
      transfer_destiny: transfer_destiny ? transfer_destiny : '',
      installment: `1/${repeated_times}`,
      credit_card_id: credit_card_id ? credit_card_id : '',
    };
    const arrayTransaction: ITransaction[] = [firstTransaction];
    if (repeat && !fixed && repeated_times) {
      for (let i = 1; i < repeated_times; i++) {
        // Adicione uma semana à data inicial
        switch (time_period) {
          case 'day':
            parsedDate = addDays(parsedDate, 1);
            arrayTransaction.push({
              ...firstTransaction,
              paid: false,
              date: format(parsedDate, 'yyyy-MM-dd'),
            });
            break;
          case 'week':
            parsedDate = addWeeks(parsedDate, 1);
            arrayTransaction.push({ ...firstTransaction, paid: false, date: format(parsedDate, 'yyyy-MM-dd') });
            break;
          case 'month':
            parsedDate = addMonths(parsedDate, 1);
            arrayTransaction.push({
              ...firstTransaction,
              paid: false,
              date: format(parsedDate, 'yyyy-MM-dd'),
              installment: `${i}/${repeated_times}`,
            });
            break;
          case 'year':
            parsedDate = addYears(parsedDate, 1);
            arrayTransaction.push({ ...firstTransaction, paid: false, date: format(parsedDate, 'yyyy-MM-dd') });
            break;
          default:
            break;
        }
      }
    }

    await transactionsRepository.save(arrayTransaction);

    return arrayTransaction;
  }
}

export { CreateTransactionService };
