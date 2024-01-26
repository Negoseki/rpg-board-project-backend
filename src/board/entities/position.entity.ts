import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Position extends Document {
  @Prop()
  x: number;

  @Prop()
  y: number;
}
