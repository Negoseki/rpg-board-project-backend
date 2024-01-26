import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '../../common/decorators/user.decorator';
import { UserData } from '../../common/types/user.type';
import { BoardResponseDto } from '../dto/board-response.dto';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardFigureDto } from '../dto/update-board-figure.dto';
import { BoardService } from '../service/board.service';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  getBoardList(@User() user: UserData): Promise<BoardResponseDto[]> {
    return this.boardService.findByUser(user.id);
  }

  @Get(':id')
  getBoard(@Param('id') id: string): Promise<BoardResponseDto> {
    return this.boardService.findOne(id);
  }

  @Post()
  createBoard(
    @User() user: UserData,
    @Body() body: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    return this.boardService.create(body, user.id);
  }

  @Put(':id/figure/:idFigure')
  addBoardfigure(
    @Param('id') id: string,
    @Param('idFigure') idFigure: string,
    @Body() body: UpdateBoardFigureDto,
  ): Promise<BoardResponseDto> {
    return this.boardService.updateBoardFigure(id, idFigure, body);
  }
}
