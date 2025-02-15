import { BooksService } from 'src/books/books.service';

import { Module } from '@nestjs/common';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [BooksService],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
