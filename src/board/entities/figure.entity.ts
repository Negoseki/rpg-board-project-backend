import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Position } from './position.entity';

@Schema()
export class Figure extends Document {
  @Prop()
  imageUrl: string;

  @Prop()
  name: string;

  @Prop()
  size: number;

  @Prop()
  position: Position;

  id: string;
}

const FigureSchema = SchemaFactory.createForClass(Figure);
FigureSchema.virtual('id').get(function (this: Figure) {
  return this._id.toHexString();
});
FigureSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
  },
});

export { FigureSchema };
