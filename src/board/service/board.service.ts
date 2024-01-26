import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { ImageService } from '../../image/service/image.service';
import { BoardResponseDto } from '../dto/board-response.dto';
import { CreateBoardFigureDto } from '../dto/create-board-figure.dto';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardFigureDto } from '../dto/update-board-figure.dto';
import { Board } from '../entities/board.entity';
import { BoardUserRole } from '../enums/board-user-role.enum';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<BoardResponseDto> {
    const board = await new this.boardModel({
      ...createBoardDto,
      figures: [],
      users: [
        {
          id: userId,
          role: BoardUserRole.ADMIN,
        },
      ],
    }).save();
    return this.mapBoardToDto(board);
  }

  async findOne(id: string): Promise<BoardResponseDto> {
    const board = await this.boardModel.findById(id);
    if (!board) {
      throw new NotFoundException(`Board ${id} not found`);
    }
    return this.mapBoardToDto(board);
  }

  async findByUser(userId: string): Promise<BoardResponseDto[]> {
    const boards = await this.boardModel.find({
      'users.id': userId,
    });

    const boardsResponseDto = boards.map((board) => this.mapBoardToDto(board));
    console.log({ boardsResponseDto });
    return boardsResponseDto;
  }

  async updateBoardFigure(
    id: string,
    idFigure: string,
    updateFigureDto: UpdateBoardFigureDto,
  ): Promise<BoardResponseDto> {
    const setObj = Object.keys(updateFigureDto).reduce(
      (acc, cur) => ({ ...acc, [`figures.$[i].${cur}`]: updateFigureDto[cur] }),
      {},
    );

    const board = await this.boardModel.findOneAndUpdate(
      { _id: id },
      { $set: setObj },
      {
        arrayFilters: [{ 'i._id': new Types.ObjectId(idFigure) }],
        new: true,
      },
    );
    return this.mapBoardToDto(board);
  }

  async createBoardFigure(
    id: string,
    createFigureDto: CreateBoardFigureDto,
  ): Promise<BoardResponseDto> {
    const image = await this.imageService.findByURL(createFigureDto.imageUrl);
    if (!image) {
      throw new NotFoundException('Board Figure image not found');
    }
    const newFigure = {
      imageKey: image.key,
      name: createFigureDto.name,
      size: createFigureDto.size,
      position: createFigureDto.position,
    };

    const newBoardFigure = await this.boardModel.findOneAndUpdate(
      { _id: id },
      {
        $push: { figures: newFigure },
      },
      {
        new: true,
      },
    );

    return this.mapBoardToDto(newBoardFigure);
  }

  private mapBoardToDto(board: Board): BoardResponseDto {
    const boardResponseDto = plainToClass(BoardResponseDto, board.toJSON(), {
      enableCircularCheck: true,
    });
    for (let i = 0; i < boardResponseDto.figures.length; i++) {
      boardResponseDto.figures[i].imageUrl = this.imageService.getUrl(
        boardResponseDto.figures[i].imageKey,
      );
    }
    return boardResponseDto;
  }
}
