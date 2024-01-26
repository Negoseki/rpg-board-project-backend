import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Position } from './position.entity';

@Schema()
export class Figure extends Document {
  @Prop()
  imageKey: string;

  @Prop()
  name: string;

  @Prop()
  size: number;

  @Prop()
  position: Position;

  id: string;
}
