import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
  @Column({ default: 0 })
  stock: number;
  @Column()
  published_date: Date;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
}
