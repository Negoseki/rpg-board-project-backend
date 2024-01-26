import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsObject, IsString, IsUrl } from 'class-validator';

@Exclude()
class Position {
  @Expose()
  @IsInt()
  x: number;

  @Expose()
  @IsInt()
  y: number;
}

@Exclude()
export class BoardFigureResponseDto {
  @Expose()
  @IsString()
  imageKey: string;

  @Expose()
  @IsUrl()
  imageUrl: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsInt()
  size: number;

  @Expose()
  @IsObject()
  position: Position;

  id: string;
}
