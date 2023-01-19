import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('accounts')
class Account {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user_id: string;

  @Column()
  account_name: string;

  @Column()
  bank: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  color: string;

  @Column()
  simulated_yield: number;

  @Column()
  yield_model: string;

  @Column()
  initial_price: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Account };
