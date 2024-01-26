import { IsArray, IsEnum, IsString } from 'class-validator';
import { BoardUserRole } from '../enums/board-user-role.enum';
import { BoardFigureResponseDto } from './board-figure-response.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class BoardUserResponseDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsEnum(BoardUserRole)
  role: BoardUserRole;
}

@Exclude()
export class BoardResponseDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsArray()
  figures: BoardFigureResponseDto[];

  @Expose()
  @IsArray()
  users: BoardUserResponseDto[];

  @Expose()
  @IsString()
  id: string;
}
