import { Transaction } from '../../app/models/schemas/Transaction';
import { Account } from '../../app/models/schemas/Account';
import { Tag } from '../../app/models/schemas/Tag';
import { Category } from '../../app/models/schemas/Category';
import { getMongoRepository } from 'typeorm';
import User from '../../app/models/schemas/User';
import { addDays, addMonths, addWeeks, addYears, format, isValid, parse } from 'date-fns';

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
  currency: string;
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
  }: IRequest): Promise<Transaction> {
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

    const transactionsRepository = getMongoRepository(Transaction);
    const firstTransaction = {
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
    };
    const arrayTransaction = [firstTransaction];
    if (repeat && !fixed && repeated_times) {
      for (let i = 1; i < repeated_times; i++) {
        // Adicione uma semana à data inicial
        switch (time_period) {
          case 'day':
            parsedDate = addDays(parsedDate, 1);
            arrayTransaction.push({ ...firstTransaction, paid: false, date: format(parsedDate, 'yyyy-MM-dd') });
            break;
          case 'week':
            parsedDate = addWeeks(parsedDate, 1);
            arrayTransaction.push({ ...firstTransaction, paid: false, date: format(parsedDate, 'yyyy-MM-dd') });
            break;
          case 'month':
            parsedDate = addMonths(parsedDate, 1);
            arrayTransaction.push({ ...firstTransaction, paid: false, date: format(parsedDate, 'yyyy-MM-dd') });
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

    console.log('arrayTransaction', arrayTransaction);

    const transaction = transactionsRepository.create({
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
    });

    await transactionsRepository.save(arrayTransaction);

    return transaction;
  }
}

export { CreateTransactionService };
