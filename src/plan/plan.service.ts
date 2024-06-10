import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { PlanDto } from './dto/plan.dto';
  import { Plans } from './schema/plan.schema';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { generateRandomNumber } from 'src/utils/common';
  
  @Injectable()
  export class PlansService {
    constructor(@InjectModel(Plans.name) private PlanModel: Model<Plans>) {}
  
    async createPlan(planDto: PlanDto, res) {
      try {
        const {
          planName,
          planDescription,
          planAmount,
          instanceCount,
          discountedAmount,
  
          feature,
        } = planDto;
  
        const discountPercent = (discountedAmount / planAmount) * 100;
  
        let planId = 'PL' + generateRandomNumber(6);
  
        const addCreer = await this.PlanModel.create({
          planId,
          planName,
          planDescription,
          planAmount,
          instanceCount,
          discountedAmount,
          discountPercent,
          feature,
        });
  
        await addCreer.save();
  
        res.status(200).send({ message: 'Plan created successfully', planId });
      } catch (error) {
        if (error instanceof BadRequestException) {
          res.status(400).send({ message: error.message });
        } else {
          console.error('Error creating plan:', error);
          throw new InternalServerErrorException('Failed to create plan');
        }
      }
    }
  
    async getAllPlan(req, res) {
      try {
        const plans = await this.PlanModel.find().exec();
        res
          .status(200)
          .send({ message: 'Plans fetched successfully', plans: plans });
      } catch (error) {
        console.error('Error fetching plans:', error);
        throw new InternalServerErrorException('Failed to fetch plans');
      }
    }
  
    async getPlan(res, id) {
      try {
        if (!id) {
          throw new BadRequestException('Plan ID is required');
        }
  
        const plan = await this.PlanModel.findById(id).exec();
  
        if (!plan) {
          throw new BadRequestException('Plan not found');
        }
  
        res.status(200).send({ message: 'Plan fetched successfully', plan });
      } catch (error) {
        console.error('Error to fetching plan', error);
        throw new InternalServerErrorException('Failed to fetch plan');
      }
    }
  }