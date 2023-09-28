import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  id: string;
}
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get<User>(function (this: User) {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});
export { UserSchema };
