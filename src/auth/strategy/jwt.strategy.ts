import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserData } from '../../common/types/user.type';
import { UsersService } from '../../users/service/users.service';
import { JWTToken } from '../types/jwt-token.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>(
          'AUTH0_ISSUER_URL',
        )}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: `${configService.get<string>('AUTH0_ISSUER_URL')}`,
      algorithms: ['RS256'],
    });
    console.log(configService.get<string>('AUTH0_AUDIENCE'));
  }

  async validate(payload: JWTToken): Promise<UserData> {
    let user = await this.usersService.findOneByAuth(payload.sub);

    if (!user) {
      user = await this.usersService.create({ authId: payload.sub });
    }

    return { id: user.id };
  }
}
