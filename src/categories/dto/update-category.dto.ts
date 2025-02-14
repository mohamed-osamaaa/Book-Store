import { IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;
}
