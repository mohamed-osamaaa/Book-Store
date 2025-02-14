import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name is required and cannot be empty.' })
  name: string;

  @IsNotEmpty({ message: 'Description is required and cannot be empty.' })
  description: string;
}
