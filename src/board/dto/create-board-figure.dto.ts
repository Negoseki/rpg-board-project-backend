import { IsNumber, IsObject, IsString } from 'class-validator';

class PositionDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class CreateBoardFigureDto {
  @IsString()
  imageUrl: string;

  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsObject()
  position: PositionDto;
}
