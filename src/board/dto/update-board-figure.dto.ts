import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardFigureDto } from './create-board-figure.dto';

export class UpdateBoardFigureDto extends PartialType(CreateBoardFigureDto) {}
