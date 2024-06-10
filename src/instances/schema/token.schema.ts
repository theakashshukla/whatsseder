import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type UserTokenDocument = UserToken & Document;

@Schema({timestamps:true})
export class UserToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({ type: [Types.ObjectId], ref: 'Instance' })
  clientIds: Types.ObjectId[];
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);