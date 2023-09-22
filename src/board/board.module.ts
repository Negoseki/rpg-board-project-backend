import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardController } from './controller/board.controller';
import { Board, BoardSchema } from './entities/board.entity';
import { BoardGateway } from './gateway/board.gateway';
import { BoardService } from './service/board.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Board.name,
        schema: BoardSchema,
      },
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardGateway],
})
export class BoardModule {}
