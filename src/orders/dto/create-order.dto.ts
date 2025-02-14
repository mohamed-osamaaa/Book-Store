import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateShippingDto } from './create-shipping.dto';
import { OrderedBooksDto } from './ordered-books.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrderedBooksDto)
  @ValidateNested()
  orderedBooks: OrderedBooksDto[];
}
