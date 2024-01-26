import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BoardUserRole } from '../enums/board-user-role.enum';

@Schema({ _id: false })
export class BoardUser extends Document {
  @Prop()
  id: string;

  @Prop({ type: String, enum: BoardUserRole, default: BoardUserRole.MEMBER })
  role: string;
}
