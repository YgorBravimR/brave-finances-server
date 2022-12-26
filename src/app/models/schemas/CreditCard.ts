import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('credit_cards')
class CreditCard {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user_id: string;

  @Column()
  flag: string;

  @Column()
  account_id: string;

  @Column()
  description: string;

  @Column()
  limit: number;

  @Column()
  close_date: number;

  @Column()
  due_date: number;

  @Column()
  enable: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { CreditCard };
