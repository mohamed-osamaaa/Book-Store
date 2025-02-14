import { BookEntity } from 'src/books/entities/book.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { OrderEntity } from './order.entity';

@Entity({ name: 'orders_books' })
export class OrdersBooksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  quantity: number;
  @ManyToOne(() => OrderEntity, (order) => order.orderBook, {
    onDelete: 'CASCADE',
  })
  order: OrderEntity;

  @ManyToOne(() => BookEntity, (book) => book.orderBook, {
    onDelete: 'CASCADE',
  })
  book: BookEntity;
}
