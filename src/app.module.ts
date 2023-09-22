import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    BoardModule,
    MongooseModule.forRoot('mongodb://localhost:27017/rpg-board'),
  ],
})
export class AppModule {}
