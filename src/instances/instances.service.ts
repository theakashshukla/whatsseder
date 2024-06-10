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

@Injectable()
export class InstancesService {
  constructor(
    @InjectModel(Instance.name) private InstanceModel: Model<Instance>,
    private jwtService: JwtService,
  ) {}

  async createClientId(body, res) {
    try {
      const { userId, count, type } = body;
      if (!userId || !count || !type) {
        throw new Error('userId, count and type is required');
      }
      const clientIds = generateClientIds(count);
      const createToken = this.jwtService.sign({userId:userId,clientIds:clientIds})
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
