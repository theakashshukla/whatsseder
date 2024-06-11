import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { User } from '../schema/auth.shcema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies.ADMIN;
      },
      secretOrKey: configService.get<string>('ADMIN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    try {
      const user = await this.UserModel.findById(id);
      if (!user) {
        throw new NotFoundException(
          'User not authenticated. Please log in again.',
        );
      }

      return user;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}