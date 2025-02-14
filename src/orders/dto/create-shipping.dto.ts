import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone Can not be empty.' })
  @IsString({ message: 'Phone format should be string' })
  phone: string;

  @IsNotEmpty({ message: 'address Can not be empty.' })
  @IsString({ message: 'address format should be string' })
  address: string;

  @IsNotEmpty({ message: 'city Can not be empty.' })
  @IsString({ message: 'city format should be string' })
  city: string;

  @IsNotEmpty({ message: 'postCode Can not be empty.' })
  @IsString({ message: 'postCode format should be string' })
  postCode: string;
}
