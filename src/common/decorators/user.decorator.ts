import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserData } from '../types/user.type';

export const User = createParamDecorator<UserData>(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserData;
  },
);
