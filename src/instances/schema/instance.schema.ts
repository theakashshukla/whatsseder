import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type InstanceDocument = Instance & Document;

@Schema({ timestamps: true })
export class Instance {
  @Prop({ type: String, required: true, unique: true })
  clientId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now() })
  commencementDate: Date;

  @Prop({ type: String, enums: ['Trial', 'Paid'], default: 'Trial' })
  type: string;

  @Prop({ type: Date })
  expiryDate: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const InstanceSchema = SchemaFactory.createForClass(Instance);