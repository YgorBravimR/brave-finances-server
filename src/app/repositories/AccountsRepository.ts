/* eslint-disable prettier/prettier */
import { Account } from '../models/Account';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Account)
class AccountsRepository extends Repository<Account> { }

export { AccountsRepository };
