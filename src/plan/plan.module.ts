import { Module } from '@nestjs/common';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Plans, PlansSchema } from './schema/plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plans.name, schema: PlansSchema }]),
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}