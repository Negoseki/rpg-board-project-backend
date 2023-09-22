import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Position extends Document {
  @Prop()
  x: number;

  @Prop()
  y: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
