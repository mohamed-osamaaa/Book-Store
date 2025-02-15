import { AuthorEntity } from 'src/authors/entities/author.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { OrdersService } from 'src/orders/orders.service';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
  ) {}

  async create(
    createBookDto: CreateBookDto,
    currentAuthor: AuthorEntity,
  ): Promise<BookEntity> {
    const category = await this.categoryService.findOne(
      +createBookDto.categoryId,
    );

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const book = this.bookRepository.create(createBookDto);
    book.category = category;
    book.ComposesBy = currentAuthor;

    return await this.bookRepository.save(book);
  }

  async findAll(
    query: any,
  ): Promise<{ books: BookEntity[]; totalBooks: number; limit: number }> {
    const limit = query.limit ? Number(query.limit) : 4;
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoin('book.reviews', 'review')
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'COALESCE(AVG(review.ratings), 0) AS avgRating',
      ])
      .groupBy('book.id, category.id');

    if (query.search) {
      queryBuilder.andWhere('book.title LIKE :title', {
        title: `%${query.search}%`,
      });
    }

    if (query.category) {
      queryBuilder.andWhere('category.id = :id', { id: query.category });
    }

    if (query.minPrice) {
      queryBuilder.andWhere('book.price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice) {
      queryBuilder.andWhere('book.price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    if (query.minRating) {
      queryBuilder.having('AVG(review.ratings) >= :minRating', {
        minRating: query.minRating,
      });
    }

    if (query.maxRating) {
      queryBuilder.having('AVG(review.ratings) <= :maxRating', {
        maxRating: query.maxRating,
      });
    }

    queryBuilder.limit(limit);
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const books = await queryBuilder.getMany();
    const totalBooks = await queryBuilder.getCount();

    return { books, totalBooks, limit };
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      relations: {
        ComposesBy: true,
        category: true,
      },
      select: {
        ComposesBy: {
          id: true,
          name: true,
          // email: true,
        },
        category: {
          id: true,
          name: true,
        },
      },
    });

    if (!book) throw new NotFoundException('Book not found.');
    return book;
  }

  async update(
    id: number,
    updateBookDto: Partial<UpdateBookDto>,
    currentAuthor: AuthorEntity,
  ): Promise<BookEntity> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    book.ComposesBy = currentAuthor;

    if (updateBookDto.categoryId) {
      const category = await this.categoryService.findOne(
        +updateBookDto.categoryId,
      );
      if (!category) throw new NotFoundException('Category not found.');
      book.category = category;
    }

    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<BookEntity> {
    const book = await this.findOne(id);
    const order = await this.orderService.findOneByBookId(book.id);

    if (order)
      throw new BadRequestException('Book is in use and cannot be deleted.');

    return await this.bookRepository.remove(book);
  }

  async updateStock(
    id: number,
    stock: number,
    status: OrderStatus,
  ): Promise<BookEntity> {
    const book = await this.findOne(id);
    book.stock += status === OrderStatus.DELIVERED ? -stock : stock;
    return await this.bookRepository.save(book);
  }
}
