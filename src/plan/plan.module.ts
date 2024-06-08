import { Module } from '@nestjs/common';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService]
})
export class PlansModule {}
