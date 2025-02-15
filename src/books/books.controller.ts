import { BooksService } from 'src/books/books.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { SerializeIncludes } from 'src/utility/interceptors/serialize.interceptor';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BookEntity> {
    return await this.booksService.create(createBookDto, currentUser);
  }

  @SerializeIncludes(BookEntity)
  @Get()
  async findAll(
    @Query() query: any,
  ): Promise<{ books: BookEntity[]; totalBooks: number; limit: number }> {
    return await this.booksService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BookEntity> {
    return await this.booksService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BookEntity> {
    return await this.booksService.update(+id, updateBookDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BookEntity> {
    return await this.booksService.remove(+id);
  }
}
