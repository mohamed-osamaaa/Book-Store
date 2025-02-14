import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(
    userSignUpDto: UserSignUpDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) throw new BadRequestException('Email is not available.');

    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async signin(
    userSignInDto: UserSignInDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: userSignInDto.email })
      .getOne();

    if (
      !userExists ||
      !(await compare(userSignInDto.password, userExists.password))
    ) {
      throw new BadRequestException('Bad credentials.');
    }

    const { password, ...userWithoutPassword } = userExists;
    return userWithoutPassword;
  }
  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found.');

    if ('roles' in updateUserDto) {
      throw new BadRequestException('You are not allowed to modify roles.');
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { success: true, message: 'User deleted successfully' };
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: Partial<UserEntity>): Promise<string> {
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY || 'defaultSecret';
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRE_TIME || '24h';

    return sign({ id: user.id, email: user.email }, secretKey, { expiresIn });
  }
}
