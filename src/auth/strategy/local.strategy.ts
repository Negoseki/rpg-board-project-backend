import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
