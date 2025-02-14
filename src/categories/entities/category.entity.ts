import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
}
