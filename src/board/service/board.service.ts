import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardFigureDto } from '../dto/update-board-figure.dto';
import { Board } from '../entities/board.entity';
import { CreateBoardFigureDto } from '../dto/create-board-figure.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = new this.boardModel({ ...createBoardDto, figures: [] });
    return board.save();
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardModel.findById(id);
    if (!board) {
      throw new NotFoundException(`Board ${id} not found`);
    }
    return board;
  }

  async updateBoardFigure(
    id: string,
    idFigure: string,
    updateFigureDto: UpdateBoardFigureDto,
  ): Promise<Board> {
    const setObj = Object.keys(updateFigureDto).reduce(
      (acc, cur) => ({ ...acc, [`figures.$[i].${cur}`]: updateFigureDto[cur] }),
      {},
    );

    return await this.boardModel.findOneAndUpdate(
      { _id: id },
      { $set: setObj },
      {
        arrayFilters: [{ 'i._id': new Types.ObjectId(idFigure) }],
        new: true,
      },
    );
  }

  async createBoardFigure(
    id: string,
    createFigureDto: CreateBoardFigureDto,
  ): Promise<Board> {
    return await this.boardModel.findOneAndUpdate(
      { _id: id },
      {
        $push: { figures: createFigureDto },
      },
      {
        new: true,
      },
    );
  }
}
