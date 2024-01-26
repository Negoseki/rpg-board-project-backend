import { IsInt, IsString } from 'class-validator';

export class CreateFigureDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly size: number;
}
