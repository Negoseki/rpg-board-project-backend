import { FigureController } from './controller/figure.controller';
import { FigureService } from './service/figure.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from '../image/image.module';
import { Figure, FigureSchema } from './entities/figure.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Figure.name,
        schema: FigureSchema,
      },
    ]),
    ImageModule,
  ],
  controllers: [FigureController],
  providers: [FigureService],
})
export class FigureModule {}
