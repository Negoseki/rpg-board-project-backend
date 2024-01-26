import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../common/decorators/user.decorator';
import { UserData } from '../../common/types/user.type';
import { CreateFigureDto } from '../dto/create-figure.dto';
import { FigureResponseDto } from '../dto/figure-response.dto';
import { FigureService } from '../service/figure.service';

@Controller('figure')
export class FigureController {
  constructor(private readonly figureService: FigureService) {}

  @Get()
  getBoardList(@User() user: UserData): Promise<FigureResponseDto[]> {
    return this.figureService.findByUser(user.id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createFigure(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1000 * 1000 }),
          new FileTypeValidator({ fileType: /^image\/(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() body: CreateFigureDto,
    @User() user: UserData,
  ): Promise<FigureResponseDto> {
    return this.figureService.createFigure(image, body, user.id);
  }
}
