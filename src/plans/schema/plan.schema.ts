import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PlansDocument = HydratedDocument<Plans>;

@Schema({ timestamps: true })
export class Plans {
  @Prop({ type: String, required: true, unique: true })
  planId: string;

  @Prop({ type: String, required: true })
  planName: string;

  @Prop({ type: String, required: true })
  planDescription: string;

  @Prop({ type: Number, required: true })
  planAmount: number;

  @Prop({ type: Number, required: true })
  instanceCount: number;

  @Prop({ type: Number })
  DiscountedAmount: number;

  @Prop({ type: Array })
  feature: [];

  @Prop({ type: Number })
  discountPercent: number;
}
export const PlansSchema = SchemaFactory.createForClass(Plans);
