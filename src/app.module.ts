import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_HOST: Joi.required(),
        API_KEY: Joi.required(),
        JWT_SECRET: Joi.required(),
        JWT_EXPIRES_IN: Joi.required(),
        PASSWORD_SALT_ROUNDS: Joi.required(),
      }),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_HOST'),
      }),
    }),
    CommonModule,
    AuthModule,
    BoardModule,
  ],
})
export class AppModule {}
