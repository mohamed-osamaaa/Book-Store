import { UserEntity } from 'src/users/entities/user.entity';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): UserEntity | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser ?? null;
  },
);
