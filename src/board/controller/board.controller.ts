import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from '../entities/board.entity';
import { BoardService } from '../service/board.service';
import { UpdateBoardFigureDto } from '../dto/update-board-figure.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get(':id')
  getBoard(@Param('id') id: string): Promise<Board> {
    return this.boardService.findOne(id);
  }

  @Post()
  createBoard(@Body() body: CreateBoardDto): Promise<Board> {
    return this.boardService.create(body);
  }

  @Put(':id/figure/:idFigure')
  addBoardfigure(
    @Param('id') id: string,
    @Param('idFigure') idFigure: string,
    @Body() body: UpdateBoardFigureDto,
  ) {
    return this.boardService.updateBoardFigure(id, idFigure, body);
  }
}
