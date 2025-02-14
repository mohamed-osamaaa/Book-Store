import { AuthorEntity } from 'src/authors/entities/author.entity';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrdersBooksEntity } from 'src/orders/entities/orders-books.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
  @ManyToOne(() => AuthorEntity, (author) => author.bookComposesBy)
  ComposesBy: AuthorEntity;
  @ManyToOne(() => CategoryEntity, (cat) => cat.book)
  category: CategoryEntity;
  @OneToMany(() => ReviewEntity, (rev) => rev.book)
  reviews: ReviewEntity[];
  // @ManyToMany(()=>OrderEntity,(order)=>order.) => this wrong
  @OneToMany(() => OrdersBooksEntity, (orderBook) => orderBook.book)
  orderBook: OrdersBooksEntity[];
}
