import { IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Name is required and cannot be empty.' })
  name: string;

  @IsNotEmpty({ message: 'Bio is required and cannot be empty.' })
  bio: string;
}
