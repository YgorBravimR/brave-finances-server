import { Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('tags')
class Tag {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Tag };
