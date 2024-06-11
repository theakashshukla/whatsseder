import {
  Injectable,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Instance } from './schema/instance.schema';
import { Model } from 'mongoose';
import { generateClientIds } from 'src/utils/common';
import { JwtService } from '@nestjs/jwt';
import { Plans } from 'src/plan/schema/plan.schema';
import { UserToken } from './schema/token.schema';

@Injectable()
export class InstancesService {
  constructor(
    @InjectModel(Instance.name) private InstanceModel: Model<Instance>,
    @InjectModel(UserToken.name) private UserTokenModel: Model<UserToken>,
    @InjectModel(Plans.name) private PlanModel: Model<Plans>,
    private jwtService: JwtService,
  ) {}

  async createClientId(body, res) {
    try {
      const { userId, planId } = body;
      console.log(userId, planId);

      if (!userId || !planId) {
        throw new Error('UserId and PlanId is required');
      }

      const plan = await this.PlanModel.findOne({ planId }).select(
        'instanceCount',
      );

      if (!plan) {
        throw new Error('Plan not found');
      }

      const clientIds = generateClientIds(plan.instanceCount);

      const instances = clientIds.map((clientId) => ({
        userId: userId,
        clientId: clientId,
      }));

      await this.InstanceModel.insertMany(instances);

      res.status(201).json({ message: 'ClientIds created successfully' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async generateToken(body, res) {
    try {
      const { userId } = body;

      if (!userId) {
        throw new Error('ClientId is required');
      }

      const instance = await this.InstanceModel.findOne({ userId }).select(
        '_id userId',
      );
      console.log(instance);

      if (!instance) {
        throw new Error('Instance not found');
      }

      const token = this.jwtService.sign({ userId: instance.userId });
      // console.log(token);
      await this.UserTokenModel.create({ userId: instance.userId, token: token });

      res
        .status(200)
        .json({ status: 'success', message: 'Token generated successfully' });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}