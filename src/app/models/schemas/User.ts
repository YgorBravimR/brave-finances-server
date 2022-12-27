import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('users')
class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  fullname: string;

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
