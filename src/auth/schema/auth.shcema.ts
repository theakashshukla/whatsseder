import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: [true],
    unique: [true, 'Email is already available'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String })
  ContactNo: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ default: false })
  CouponCode: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Instance' })
  clientIds: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Payments' })
  payments: Types.ObjectId[];
}
export const UserSchema = SchemaFactory.createForClass(User);