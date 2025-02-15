import { BooksService } from 'src/books/books.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    private readonly BooksService: BooksService,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    const book = await this.BooksService.findOne(createReviewDto.bookId);
    let review = await this.findOneByUserAndBook(
      currentUser.id,
      createReviewDto.bookId,
    );
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.book = book;
    } else {
      review.comment = createReviewDto.comment;
      review.rating = createReviewDto.rating;
    }
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      relations: {
        user: true,
        book: {
          category: true,
        },
      },
    });
  }

  async findAllByBook(id: number): Promise<ReviewEntity[]> {
    // const book = await this.BooksService.findOne(id);
    return await this.reviewRepository.find({
      where: { book: { id } },
      relations: {
        user: true,
        book: {
          category: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        book: {
          category: true,
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found.');
    return review;
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);

    return this.reviewRepository.remove(review);
  }
  async findOneByUserAndBook(userId: number, bookId: number) {
    return await this.reviewRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        book: {
          id: bookId,
        },
      },
      relations: {
        user: true,
        book: {
          category: true,
        },
      },
    });
  }
}
