import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageService {
  private readonly s3: S3;
  private readonly defaultBucket: string;
  private readonly defaultRegion: string;
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    private readonly configService: ConfigService,
  ) {
    this.defaultBucket = this.configService.get<string>(
      'AWS_PUBLIC_BUCKET_NAME',
    );
    this.defaultRegion = this.configService.get('AWS_REGION');

    this.s3 = new S3({
      region: this.defaultRegion,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async resizeAndCompress(
    inputBuffer: Buffer,
    options: {
      resize?: {
        width: number;
        height: number;
      };
      quality?: number;
    } = {},
  ): Promise<Buffer> {
    let sharpObj = sharp(inputBuffer);

    if (options.resize) {
      sharpObj = sharpObj.resize(options.resize.width, options.resize.height);
    }

    return sharpObj
      .webp({ quality: options.quality || 80 })
      .ensureAlpha(0)
      .toBuffer();
  }

  async uploadImage(image: Buffer, filename: string): Promise<Image> {
    const compressImg = await this.resizeAndCompress(image);
    const ext = 'webp';
    const key = `${uuid()}-${filename.replace(/(?:[^\w]+|\s+)/g, '')}.${ext}`;
    const uploadCmd = new PutObjectCommand({
      Bucket: this.defaultBucket,
      Key: key,
      Body: compressImg,
      ContentType: 'image/webp',
    });

    try {
      await this.s3.send(uploadCmd);
      const url = this.getUrl(key);
      const newImage = new this.imageModel({
        key,
        url,
      });
      return newImage.save();
    } catch (e) {
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  async findByKey(key: string): Promise<Image> {
    return this.imageModel.findOne({ key });
  }

  async findByURL(url: string): Promise<Image> {
    const path = this.getUrl('');
    const key = url.replace(path, '');

    return this.imageModel.findOne({ key });
  }

  getUrl(key: string): string {
    return `https://${this.defaultBucket}.s3.${this.defaultRegion}.amazonaws.com/${key}`;
  }
}
