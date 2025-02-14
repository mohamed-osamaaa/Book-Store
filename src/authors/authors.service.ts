import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorEntity } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorEntity> {
    const author = this.authorRepository.create(createAuthorDto);
    return await this.authorRepository.save(author);
  }

  async findAll(): Promise<AuthorEntity[]> {
    return await this.authorRepository.find();
  }

  async findOne(id: number): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOneBy({ id });
    if (!author) throw new NotFoundException('Author not found.');
    return author;
  }

  async update(
    id: number,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<AuthorEntity> {
    const author = await this.findOne(id);
    if (!author) throw new NotFoundException('Author not found.');
    await this.authorRepository.update(id, updateAuthorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const author = await this.findOne(id);
    await this.authorRepository.remove(author);
    return { success: true, message: 'Author deleted successfully' };
  }
}
