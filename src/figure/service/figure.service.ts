import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { ImageService } from '../../image/service/image.service';
import { CreateFigureDto } from '../dto/create-figure.dto';
import { FigureResponseDto } from '../dto/figure-response.dto';
import { Figure } from '../entities/figure.entity';

@Injectable()
export class FigureService {
  constructor(
    @InjectModel(Figure.name) private readonly figureModel: Model<Figure>,
    private readonly imageService: ImageService,
  ) {}

  async findByUser(userId: string): Promise<FigureResponseDto[]> {
    const figures = await this.figureModel.find({
      userId,
    });

    const figuresDto = figures.map((figure) => {
      const figureDto = plainToClass(FigureResponseDto, figure);
      figureDto.imageUrl = this.imageService.getUrl(figure.imageKey);
      return figureDto;
    });

    return figuresDto;
  }
  async createFigure(
    image: Express.Multer.File,
    createFigureDto: CreateFigureDto,
    userId: string,
  ): Promise<FigureResponseDto> {
    const resizedImg = await this.imageService.resizeAndCompress(image.buffer, {
      resize: {
        width: 280,
        height: 280,
      },
    });
    const newImage = await this.imageService.uploadImage(
      resizedImg,
      createFigureDto.name,
    );
    const figure = new this.figureModel({
      ...createFigureDto,
      userId,
      imageKey: newImage.key,
    });

    const newFigure = await figure.save();

    const responseDto = plainToClass(FigureResponseDto, newFigure);

    responseDto.imageUrl = this.imageService.getUrl(newFigure.imageKey);

    return responseDto;
  }
}
