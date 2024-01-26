import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardFigureDto } from './create-board-figure.dto';
import { IsString } from 'class-validator';

export class UpdateBoardFigureDto extends PartialType(CreateBoardFigureDto) {
  @IsString()
  id: string;
}
