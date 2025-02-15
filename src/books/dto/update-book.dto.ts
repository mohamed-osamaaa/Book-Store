import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBookDto {
  @IsOptional({ message: 'Title is required and cannot be empty.' })
  title: string;

  @IsOptional({ message: 'Price is required and cannot be empty.' })
  price: number;

  @IsOptional({ message: 'Stock is required and cannot be empty.' })
  stock: number;

  @IsOptional({ message: 'Published date is required and cannot be empty.' })
  published_date: Date;

  @IsOptional({ message: 'category should not be empty.' })
  @IsNumber({}, { message: 'category id should be a number' })
  categoryId: number;
}
