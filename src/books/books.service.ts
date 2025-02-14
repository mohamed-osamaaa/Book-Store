import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<BookEntity[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Author not found.');
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<BookEntity> {
    const book = await this.findOne(id);
    if (!book) throw new NotFoundException('Author not found.');
    await this.bookRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    return { success: true, message: 'Author deleted successfully' };
  }
}
