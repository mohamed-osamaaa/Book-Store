import { BookEntity } from 'src/books/entities/book.entity';

import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [BookEntity],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
