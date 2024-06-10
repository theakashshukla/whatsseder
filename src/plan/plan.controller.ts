import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Res,
    ValidationPipe,
  } from '@nestjs/common';
  import { PlansService } from './plan.service';
  import { PlanDto } from './dto/plan.dto';
  
  @Controller('plans')
  export class PlansController {
    constructor(private readonly PlansService: PlansService) {}
  
    @Post('/createPlan')
    async createPlan(
      @Body(ValidationPipe) planDto: PlanDto,
      @Res() res: Response,
    ) {
      await this.PlansService.createPlan(planDto, res);
    }
  
    @Get('/getAllPlan')
    async getAllPlan(@Body() body: any, @Res() res: Response) {
      await this.PlansService.getAllPlan(body, res);
    }
  
    @Get('/getPlan/:id')
    async getPlan(@Res() res: Response, @Param('id') id: string) {
      await this.PlansService.getPlan(res, id);
    }
  }