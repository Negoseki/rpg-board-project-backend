import { ImageModule } from './image/image.module';
import { FigureModule } from './figure/figure.module';
import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ImageModule,
    FigureModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_HOST: Joi.required(),
        API_KEY: Joi.required(),
        AUTH0_ISSUER_URL: Joi.required(),
        AUTH0_AUDIENCE: Joi.required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
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
    AuthModule,
    CommonModule,
    BoardModule,
  ],
})
export class AppModule {}
