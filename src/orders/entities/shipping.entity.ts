import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderEntity } from './order.entity';

@Entity({ name: 'shippings' })
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @OneToOne(() => OrderEntity, (order) => order.shipping, {
    onDelete: 'CASCADE',
  })
  @JoinColumn() // This ensures `orderId` is the foreign key in the `shippings` table
  order: OrderEntity;
}
