import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @AuthorizeRoles(Roles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
