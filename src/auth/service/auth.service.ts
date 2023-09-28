import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/service/users.service';
import { AuthDto } from '../dto/auth.dto';
import { CreateAccountDto } from '../dto/create-account.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOneByCredential({
      username: login,
      email: login,
    });
    if (!user) {
      return null;
    }

    const passwordMatch = await compare(pass, user.password);

    if (!passwordMatch) {
      return null;
    }

    delete user.password;
    return user;
  }

  async login(user: User): Promise<AuthDto> {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<AuthDto> {
    const user = await this.userService.findOneByCredential(createAccountDto);
    if (user) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.userService.create(createAccountDto);

    if (!newUser) {
      throw new BadRequestException('Unable to create the user');
    }
    return this.login(newUser);
  }
}
