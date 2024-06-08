import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  transactionType: string;

  @Prop({ type: String })
  transactionAmount: string;

  @Prop({ type: String, enum: ['success', 'failed', 'pending'] })
  transactionStatus: string;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
