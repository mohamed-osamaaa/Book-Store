import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  rating: number;

  @Column()
  comment: string;
}
