/* eslint-disable prettier/prettier */
import { Transaction } from '../models/Transaction';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> { }

export { TransactionsRepository };
