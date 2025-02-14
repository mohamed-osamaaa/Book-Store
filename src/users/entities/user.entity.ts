import { OrderEntity } from 'src/orders/entities/order.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  // @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  // roles: Roles[];
  @Column({
    type: 'set',
    enum: UserRole,
    default: [UserRole.USER],
  })
  roles: UserRole[];

  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @OneToMany(() => OrderEntity, (order) => order.updatedBy)
  ordersUpdateBy: OrderEntity[];
  @OneToMany(() => ReviewEntity, (rev) => rev.user)
  reviews: ReviewEntity[];
}
