import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { Injectable, NestMiddleware } from '@nestjs/common';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity | null;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      return next();
    }

    try {
      const token = authHeader.split(' ')[1];
      const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
      if (!secretKey) {
        throw new Error('ACCESS_TOKEN_SECRET_KEY is not defined');
      }

      const decoded = verify(token, secretKey) as JwtPayload;
      if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        req.currentUser = null;
        return next();
      }

      const { id } = decoded;
      const currentUser = await this.usersService.findOne(+id);
      req.currentUser = currentUser || null;
    } catch (err) {
      req.currentUser = null;
    }

    next();
  }
}

interface JwtPayload {
  id: string;
}
