import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './User';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  account: string;

  @Column('integer')
  value: number;

  @Column()
  description: string;

  @Column()
  type: 'income' | 'expense';

  @Column()
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Transaction };
