import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product should not be empty.' })
  @IsNumber({}, { message: 'Product Id should be number' })
  bookId: number;

  @IsNotEmpty({ message: 'rating can not be empty.' })
  @MinLength(1, { message: 'rating minimum character should be 1.' })
  @MaxLength(5, { message: 'rating maximum character should be 5.' })
  rating: number;

  @IsNotEmpty({ message: 'comment can not be empty.' })
  @MinLength(10, { message: 'comment minimum character should be 10.' })
  @MaxLength(1000, { message: 'comment maximum character should be 1000.' })
  comment: string;
}
