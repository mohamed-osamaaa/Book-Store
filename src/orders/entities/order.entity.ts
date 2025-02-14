import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

import { OrderStatus } from '../enums/order-status.enum';
import { OrdersBooksEntity } from './orders-books.entity';
import { ShippingEntity } from './shipping.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderAt: Timestamp;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_price: number;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;
  @OneToMany(() => OrdersBooksEntity, (orderBook) => orderBook.order)
  orderBook: OrdersBooksEntity[];
  @ManyToOne(() => UserEntity, (user) => user.ordersUpdateBy)
  updatedBy: UserEntity;
  @OneToOne(() => ShippingEntity, (shipping) => shipping.order, {
    cascade: true,
  })
  shipping: ShippingEntity;
}
