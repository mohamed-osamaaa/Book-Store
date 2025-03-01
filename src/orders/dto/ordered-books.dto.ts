import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderedBooksDto {
  @IsNotEmpty({ message: 'Product can not be empty.' })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price should be number & max decimal precision 2' },
  )
  @IsPositive({ message: 'Price can not be Negative.' })
  price: number;

  @IsNumber({}, { message: 'Quantity should be number' })
  @IsPositive({ message: 'Quantity can not be Negative.' })
  quantity: number;
}
