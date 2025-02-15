import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Title is required and cannot be empty.' })
  title: string;

  @IsNotEmpty({ message: 'Price is required and cannot be empty.' })
  price: number;

  @IsNotEmpty({ message: 'Stock is required and cannot be empty.' })
  stock: number;

  @IsNotEmpty({ message: 'Published date is required and cannot be empty.' })
  published_date: Date;

  @IsNotEmpty({ message: 'category should not be empty.' })
  @IsNumber({}, { message: 'category id should be a number' })
  categoryId: number;
}
