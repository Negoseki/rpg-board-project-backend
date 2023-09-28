import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await this.hashPassword(createUserDto.password);

    const user = new this.userModel({ ...createUserDto, password });

    return user.save();
  }

  async findOneByCredential(
    credential:
      | { username: string; email?: string }
      | { username?: string; email: string },
  ): Promise<User | undefined> {
    const search = [];
    if (credential.username) {
      search.push({ username: credential.username });
    }

    if (credential.email) {
      search.push({ email: credential.email });
    }

    if (!search.length) {
      return;
    }

    const user = this.userModel.findOne({
      $or: search,
    });

    return user;
  }

  async hashPassword(pass: string): Promise<string> {
    return await hash(
      pass,
      +this.configService.get<number>('PASSWORD_SALT_ROUNDS'),
    );
  }
}
