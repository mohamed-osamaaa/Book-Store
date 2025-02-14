import { IsOptional } from 'class-validator';

export class UpdateAuthorDto {
  @IsOptional({ message: 'Name is required and cannot be empty.' })
  name: string;

  @IsOptional({ message: 'Bio is required and cannot be empty.' })
  bio: string;
}
