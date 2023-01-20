import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('transactions')
class Transaction {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user_id: string;

  @Column()
  account_id: string;

  @Column()
  value: number;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  date: Date;

  @Column()
  paid: boolean;

  @Column()
  category_id: string;

  @Column()
  tag_id: string;

  @Column()
  currency: string;

  @Column()
  fixed: boolean;

  @Column()
  divided: boolean;

  @Column()
  repeat: boolean;

  @Column()
  repeated_times: number;

  @Column()
  time_period: string;

  @Column()
  transfer_origin: string;

  @Column()
  transfer_destiny: string;

  @Column()
  credit_card_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Transaction };
