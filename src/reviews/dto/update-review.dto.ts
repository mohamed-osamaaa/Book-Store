import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @MinLength(1, { message: 'rating minimum character should be 1.' })
  @MaxLength(5, { message: 'rating maximum character should be 5.' })
  rating: number;

  @IsOptional()
  @MinLength(10, { message: 'comment minimum character should be 10.' })
  @MaxLength(1000, { message: 'comment maximum character should be 1000.' })
  comment: string;
}
