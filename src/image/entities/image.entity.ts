import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Image extends Document {
  @Prop()
  url: URL;

  @Prop()
  key: string;

  id: string;
}
const ImageSchema = SchemaFactory.createForClass(Image);

ImageSchema.virtual('id').get<Image>(function (this: Image) {
  return this._id.toHexString();
});

ImageSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});
export { ImageSchema };
