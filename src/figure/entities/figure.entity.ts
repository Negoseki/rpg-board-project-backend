import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Figure extends Document {
  @Prop()
  name: string;

  @Prop()
  imageKey: string;

  @Prop()
  userId: string;

  @Prop()
  size: number;

  id: string;
}
const FigureSchema = SchemaFactory.createForClass(Figure);

FigureSchema.virtual('id').get<Figure>(function (this: Figure) {
  return this._id.toHexString();
});

FigureSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});
export { FigureSchema };
