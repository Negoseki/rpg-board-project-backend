import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Figure } from './figure.entity';

@Schema()
export class Board extends Document {
  @Prop()
  name: string;

  @Prop([Figure])
  figures: Figure[];

  id: string;
}
const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.virtual('id').get<Board>(function (this: Board) {
  return this._id.toHexString();
});

BoardSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    if (ret.figures && Array.isArray(ret.figures)) {
      ret.figures.forEach((figure) => {
        figure.id = figure._id.toHexString();
        delete figure._id;
      });
    }
  },
});
export { BoardSchema };
