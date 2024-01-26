import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class FigureResponseDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  size: number;

  @Expose()
  @IsString()
  imageUrl: string;

  @Expose()
  @IsString()
  birthDate: string;
}
